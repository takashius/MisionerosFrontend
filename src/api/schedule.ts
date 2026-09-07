import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type { ScheduleItem, SchedulePayload } from '@app-types/schedule';

export const usePublicSchedule = (fecha?: string) =>
  useQuery({
    queryKey: ['schedulePublic', fecha],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<ScheduleItem[]>('/schedule', {
        params: { fecha: fecha || undefined },
      });
      return data;
    },
  });

export const useManageSchedule = (fecha?: string) =>
  useQuery({
    queryKey: ['scheduleManage', fecha],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<ScheduleItem[]>('/schedule/manage', {
        params: { fecha: fecha || undefined },
      });
      return data;
    },
  });

export const useCreateScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SchedulePayload) => {
      const { data } = await ERDEAxios.post<ScheduleItem>('/schedule', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleManage'] });
      queryClient.invalidateQueries({ queryKey: ['schedulePublic'] });
    },
  });
};

export const useUpdateScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string } & Partial<SchedulePayload>) => {
      const { id, ...body } = payload;
      const { data } = await ERDEAxios.patch<ScheduleItem>(`/schedule/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleManage'] });
      queryClient.invalidateQueries({ queryKey: ['schedulePublic'] });
    },
  });
};

export const useDeleteScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await ERDEAxios.delete(`/schedule/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleManage'] });
      queryClient.invalidateQueries({ queryKey: ['schedulePublic'] });
    },
  });
};
