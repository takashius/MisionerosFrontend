import { QueryClient } from '@tanstack/react-query';
import { defaultQueryRetry } from '@utils/apiAuthError';

/** QueryClient compartido: no reintenta 401/403. */
export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: defaultQueryRetry,
      },
      mutations: {
        retry: false,
      },
    },
  });
