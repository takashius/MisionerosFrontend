import axios from 'axios';
import { message } from 'antd';
import urlJoin from 'url-join';
import {
  clearLocalSession,
  emitWrongProfileError,
  getApiErrorBody,
  getApiUserMessage,
  getErrorCode,
  isPublicAuthRequestUrl,
  markCompanyInactiveInStorage,
  type ApiErrorReject,
} from '@utils/apiAuthError';

const DEBUG: boolean = import.meta.env.VITE_API_DEBUG;
const locale = 'es';
const apiUrl = import.meta.env.VITE_API_URL;

const ERDEAxios = axios.create();

const DEFAULT_RATE_LIMIT_MSG = 'Demasiados intentos. Intenta más tarde.';

const rejectApiError = (payload: ApiErrorReject): Promise<never> => Promise.reject(payload);

const redirectToLogin = (): void => {
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login');
  }
};

const handleCompanyInactive = (userMessage: string): void => {
  message.warning(userMessage);
  markCompanyInactiveInStorage();
  const path = window.location.pathname;
  if (!path.startsWith('/inactive-company') && !path.startsWith('/settings/plan-payments')) {
    window.location.assign('/inactive-company');
  }
};

// interceptor for outgoing requests
ERDEAxios.interceptors.request.use(
  async (config) => {
    const userToken = localStorage.getItem('Token');
    const contentType = localStorage.getItem('contentType');
    const responseType = localStorage.getItem('responseType');
    if (userToken) {
      config.headers['Authorization'] = 'Bearer ' + userToken;
    }
    config.headers['Accept-Language'] = locale;
    // Con FormData no tocamos Content-Type: axios/browser lo fija con el boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-type'];
      if (DEBUG === true) console.log('Content-type', '(FormData, auto)');
    } else if (contentType) {
      config.headers['Content-type'] = 'multipart/form-data';
      if (DEBUG === true) console.log('Content-type', 'multipart/form-data');
    } else {
      if (DEBUG === true) console.log('Content-type', 'application/json');
      config.headers['Content-type'] = 'application/json';
    }
    if (responseType) {
      config.headers['responseType'] = responseType;
      if (DEBUG === true) console.log('ResponseType', responseType);
    }

    config.url = urlJoin(apiUrl!, `${config.url}`);
    if (DEBUG === true) {
      console.log('URL', config.method, config.url);
      if (config.data) {
        console.log('DATA', config.data);
      }
    }
    return config;
  },
  (error) => {
    if (DEBUG === true) {
      console.log('API CALL UNSUCCESSFUL');
      console.log(JSON.stringify(error, null, 2));
    }
    return Promise.reject(error);
  }
);

// interceptor for incoming responses
ERDEAxios.interceptors.response.use(
  (response) => {
    if (DEBUG === true) {
      console.log('API CALL RESPONSE SUCCESSFUL');
    }

    if (response?.status === 200 || response?.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    const errorMsg = JSON.stringify(error.message);

    if (DEBUG === true) {
      console.log('API ERROR', errorMsg, apiUrl);
    }

    if (!error?.response?.status) {
      return Promise.reject(error);
    }

    const status: number = error.response.status;
    const responseData = error.response.data;
    const body = getApiErrorBody(responseData);
    const code = getErrorCode(body);
    const userMessage = getApiUserMessage(body ?? responseData, 'Error inesperado');
    const requestUrl = error.config?.url as string | undefined;

    // Sesión inválida → logout (no en login/recovery para no romper credenciales inválidas)
    if (status === 401) {
      if (DEBUG) console.log('Session Expired', errorMsg, code);
      if (!isPublicAuthRequestUrl(requestUrl)) {
        clearLocalSession();
        redirectToLogin();
      }
      return rejectApiError({ status, data: responseData, code });
    }

    // Sin permisos / perfil / plan / empresa inactiva → mensaje, sin logout
    if (status === 403) {
      const closedType = body?.type === 'SCHOOL_PERIOD_CLOSED' || code === 'SCHOOL_PERIOD_READONLY';
      const isWrongProfile =
        code === 'WRONG_PROFILE' ||
        body?.error === 'Wrong active profile' ||
        (Array.isArray(body?.availableProfiles) && !!body?.selectedProfile);
      const isModuleNotAllowed =
        code === 'MODULE_NOT_ALLOWED' ||
        body?.type === 'MODULE_NOT_ALLOWED' ||
        body?.type === 'PLAN_MODULE_NOT_ALLOWED';
      const isCompanyInactive = code === 'COMPANY_INACTIVE' || body?.type === 'COMPANY_INACTIVE';

      if (DEBUG) {
        if (closedType) {
          console.log('School period closed - write operations blocked', errorMsg);
        } else {
          console.log('Forbidden', code, errorMsg);
        }
      }

      if (isCompanyInactive) {
        handleCompanyInactive(userMessage);
        return rejectApiError({
          status,
          data: responseData,
          code: 'COMPANY_INACTIVE',
          type: 'COMPANY_INACTIVE',
          toastShown: true,
        });
      }

      if (isWrongProfile) {
        emitWrongProfileError({ status: 403, data: responseData, code: 'WRONG_PROFILE' });
        return rejectApiError({
          status,
          data: responseData,
          code: 'WRONG_PROFILE',
          toastShown: true,
        });
      }

      // Páginas de módulo muestran Result dedicado; no toast genérico
      if (isModuleNotAllowed) {
        return rejectApiError({
          status,
          data: responseData,
          code: code ?? 'MODULE_NOT_ALLOWED',
          type: (body?.type as string | undefined) ?? 'MODULE_NOT_ALLOWED',
        });
      }

      message.error(userMessage);
      return rejectApiError({
        status,
        data: responseData,
        code,
        type: closedType
          ? ((body?.type as string | undefined) ?? 'SCHOOL_PERIOD_CLOSED')
          : undefined,
        toastShown: true,
      });
    }

    // Rate limit (login / recovery)
    if (status === 429) {
      const rateMessage =
        code === 'RATE_LIMITED'
          ? getApiUserMessage(body, DEFAULT_RATE_LIMIT_MSG)
          : (body?.message ?? DEFAULT_RATE_LIMIT_MSG);
      message.warning(rateMessage);
      return rejectApiError({
        status,
        data: responseData,
        code: code ?? 'RATE_LIMITED',
        toastShown: true,
        rateLimited: true,
      });
    }

    if (status === 400 && DEBUG) {
      console.log(
        'Bad Request - please check the request parameters for correct configuration',
        errorMsg
      );
    } else if (status === 404 && DEBUG) {
      console.log('Not Found', errorMsg);
    } else if (status === 502) {
      return Promise.reject(
        'Falla Temporal de comunicacion  con el servidor, intente nuevamente mas tarde'
      );
    } else if (DEBUG) {
      console.log('Error', errorMsg);
    }

    return rejectApiError({
      status,
      data: responseData,
      code,
    });
  }
);

export default ERDEAxios;
