import { getApiErrorBody, getApiUserMessage, type ApiErrorReject } from './apiAuthError';

export const getLoginErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'No se pudo iniciar sesión';
  }

  const err = error as ApiErrorReject;
  const data = err.data;
  const raw =
    typeof data === 'string'
      ? data
      : getApiUserMessage(getApiErrorBody(data), '');

  if (err.status === 401 || /user or password/i.test(raw)) {
    return 'Correo o contraseña incorrectos';
  }

  return raw.trim() || 'No se pudo iniciar sesión';
};
