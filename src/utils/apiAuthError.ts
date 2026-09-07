/** Códigos de error de auth/permisos alineados con el backend. */

export const SESSION_401_CODES = [
  'TOKEN_MISSING',
  'TOKEN_INVALID',
  'TOKEN_EXPIRED',
  'SESSION_REVOKED',
  'USER_NOT_FOUND',
] as const;

export type Session401Code = (typeof SESSION_401_CODES)[number];

export const FORBIDDEN_CODES = [
  'INSUFFICIENT_PERMISSIONS',
  'WRONG_PROFILE',
  'COMPANY_INACTIVE',
  'MODULE_NOT_ALLOWED',
  'SCHOOL_PERIOD_READONLY',
  'SUPER_ADMIN_ONLY',
  'ROUTE_NOT_REGISTERED',
] as const;

export type ForbiddenCode = (typeof FORBIDDEN_CODES)[number];

export const API_ERROR_EVENT = {
  WRONG_PROFILE: 'edu:api-wrong-profile',
} as const;

export interface ApiErrorBody {
  error?: string;
  message?: string;
  code?: string;
  type?: string;
  selectedProfile?: string;
  availableProfiles?: string[];
  [key: string]: unknown;
}

export interface ApiErrorReject {
  status: number;
  data: ApiErrorBody | string | unknown;
  type?: string;
  code?: string;
  /** El interceptor ya mostró toast; evitar duplicar en UI. */
  toastShown?: boolean;
  rateLimited?: boolean;
}

export const getApiErrorBody = (data: unknown): ApiErrorBody | null => {
  if (!data || typeof data !== 'object') return null;
  return data as ApiErrorBody;
};

/** Texto legible: error ?? message (WRONG_PROFILE prioriza message). */
export const getApiUserMessage = (
  body: ApiErrorBody | string | null | undefined,
  fallback = 'Error inesperado'
): string => {
  if (!body) return fallback;
  if (typeof body === 'string') return body.trim() || fallback;

  if (body.code === 'WRONG_PROFILE') {
    return (body.message || body.error || fallback).trim() || fallback;
  }

  const text = body.error ?? body.message;
  return (typeof text === 'string' && text.trim() ? text : fallback).trim() || fallback;
};

export const getErrorCode = (
  body: ApiErrorBody | string | null | undefined
): string | undefined => {
  if (!body || typeof body !== 'object') return undefined;
  return typeof body.code === 'string' ? body.code : undefined;
};

export const isRateLimitedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const err = error as ApiErrorReject;
  if (err.rateLimited) return true;
  if (err.status !== 429) return false;
  const body = getApiErrorBody(err.data);
  return body?.code === 'RATE_LIMITED';
};

export const wasErrorToastShown = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  return (error as ApiErrorReject).toastShown === true;
};

export const clearLocalSession = (): void => {
  localStorage.removeItem('Token');
  localStorage.removeItem('UserData');
  localStorage.removeItem('Roles');
};

export const markCompanyInactiveInStorage = (): void => {
  const raw = localStorage.getItem('UserData');
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    parsed.companyInactive = true;
    localStorage.setItem('UserData', JSON.stringify(parsed));
  } catch {
    // ignore corrupt storage
  }
};

export const isPublicAuthRequestUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return (
    url.includes('/user/login') ||
    url.includes('/user/recovery') ||
    url.includes('/user/register') ||
    url.includes('/participant/register') ||
    url.includes('/participant/lookup/') ||
    url.includes('/participant/by-token/') ||
    /\/schedule\/?(\?|$)/.test(url) ||
    /\/contact\/?(\?|$)/.test(url)
  );
};

export const emitWrongProfileError = (detail: ApiErrorReject): void => {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT.WRONG_PROFILE, { detail }));
};

export const RATE_LIMIT_COOLDOWN_MS = 60_000;

/** Status HTTP que no deben reintentarse (permisos/sesión). */
export const isNonRetryableHttpStatus = (status: number | undefined): boolean =>
  status === 401 || status === 403;

/**
 * Retry por defecto de React Query:
 * - 401/403 → no reintentar
 * - resto → hasta 3 intentos (failureCount 0..2)
 */
export const defaultQueryRetry = (failureCount: number, error: unknown): boolean => {
  const status =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status?: number }).status
      : undefined;
  if (isNonRetryableHttpStatus(status)) {
    return false;
  }
  return failureCount < 3;
};
