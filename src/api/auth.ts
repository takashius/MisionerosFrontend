import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type { LoginResponse } from '@app-types/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = (): UseMutationResult<LoginResponse, unknown, LoginPayload> =>
  useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await ERDEAxios.post<LoginResponse>('/user/login', data);
      return response.data;
    },
  });

export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const response = await ERDEAxios.post('/user/logout');
      return response.data;
    },
  });

export const useRecoveryOne = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const response = await ERDEAxios.get(`/user/recovery/${encodeURIComponent(email)}`);
      return response.data as string;
    },
  });

export type RecoveryPayload = {
  email: string;
  code: string;
  newPass: string;
};

export const useRecoveryTwo = () =>
  useMutation({
    mutationFn: async (data: RecoveryPayload) => {
      const response = await ERDEAxios.post('/user/recovery', data);
      return response.data;
    },
  });
