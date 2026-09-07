import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type {
  CreateUserPayload,
  RoleOption,
  UpdateUserPayload,
  UserListResponse,
} from '@app-types/users';

export const useUserList = (page: number, search: string) =>
  useQuery({
    queryKey: ['userList', page, search],
    queryFn: async () => {
      const path = search.trim()
        ? `/user/list/${page}/${encodeURIComponent(search.trim())}`
        : `/user/list/${page}`;
      const { data } = await ERDEAxios.get<UserListResponse>(path);
      return data;
    },
  });

export const useRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<RoleOption[]>('/user/roles');
      return data;
    },
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const { data } = await ERDEAxios.post('/user', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const { data } = await ERDEAxios.patch('/user', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await ERDEAxios.delete(`/user/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userList'] });
    },
  });
};

export const useChangeUserPassword = () =>
  useMutation({
    mutationFn: async (payload: { userId: string; password: string }) => {
      const { data } = await ERDEAxios.post(`/user/change_password/${payload.userId}`, {
        password: payload.password,
      });
      return data;
    },
  });
