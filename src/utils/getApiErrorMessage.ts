import { getApiErrorBody, getApiUserMessage, type ApiErrorReject } from './apiAuthError';

export const getApiErrorMessage = (error: unknown, fallback = 'Error inesperado'): string => {
  if (!error || typeof error !== 'object') return fallback;
  const err = error as ApiErrorReject;
  const data = err.data;
  if (typeof data === 'string' && data.trim()) return data.trim();
  const text = getApiUserMessage(getApiErrorBody(data), '');
  return text.trim() || fallback;
};
