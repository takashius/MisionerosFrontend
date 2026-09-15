import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type {
  BadgeParticipant,
  FixTypoPayload,
  Participant,
  ParticipantListParams,
  ParticipantListResponse,
  ParticipantStats,
  RegisterParticipantPayload,
} from '@app-types/participants';

export const useParticipantStats = () =>
  useQuery({
    queryKey: ['participantStats'],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<ParticipantStats>('/participant/stats');
      return data;
    },
  });

export const useParticipantList = (params: ParticipantListParams) =>
  useQuery({
    queryKey: ['participantList', params],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<ParticipantListResponse>('/participant', {
        params: {
          page: params.page,
          search: params.search?.trim() || undefined,
          estado: params.estado || undefined,
          tipo: params.tipo || undefined,
        },
      });
      return data;
    },
  });

export const useBadgeByToken = (token?: string) =>
  useQuery({
    queryKey: ['participantBadge', token],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await ERDEAxios.get<BadgeParticipant>(
        `/participant/by-token/${encodeURIComponent(token!)}`
      );
      return data;
    },
  });

export const useRegisterParticipant = () =>
  useMutation({
    mutationFn: async (payload: RegisterParticipantPayload) => {
      const { data } = await ERDEAxios.post<Participant>('/participant/register', payload);
      return data;
    },
  });

export const useUploadReceipt = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append('comprobante', file);
      const { data } = await ERDEAxios.post<{ url: string }>('/participant/upload-receipt', body);
      return data;
    },
  });

export const useLookupParticipant = () =>
  useMutation({
    mutationFn: async (documentoId: string) => {
      const { data } = await ERDEAxios.get<BadgeParticipant>(
        `/participant/lookup/${encodeURIComponent(documentoId)}`
      );
      return data;
    },
  });

export const useParticipantByDocument = () =>
  useMutation({
    mutationFn: async (documentoId: string) => {
      const { data } = await ERDEAxios.get<Participant>(
        `/participant/by-document/${encodeURIComponent(documentoId)}`
      );
      return data;
    },
  });

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; referenciaComprobante: string }) => {
      const { data } = await ERDEAxios.patch<Participant>(
        `/participant/${payload.id}/confirm-payment`,
        { referenciaComprobante: payload.referenciaComprobante }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantList'] });
      queryClient.invalidateQueries({ queryKey: ['participantStats'] });
    },
  });
};

export const useFixTypo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string } & FixTypoPayload) => {
      const { id, ...body } = payload;
      const { data } = await ERDEAxios.patch<Participant>(`/participant/${id}/fix-typo`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantList'] });
    },
  });
};

export const useUpdateParticipantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; estado: 'cancelado' | 'no_asistira' }) => {
      const { data } = await ERDEAxios.patch<Participant>(`/participant/${payload.id}/status`, {
        estado: payload.estado,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantList'] });
      queryClient.invalidateQueries({ queryKey: ['participantStats'] });
    },
  });
};

export const useUpdateLodging = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; habitacionAsignada: string | null }) => {
      const { data } = await ERDEAxios.patch<Participant>(`/participant/${payload.id}/lodging`, {
        habitacionAsignada: payload.habitacionAsignada,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantList'] });
      queryClient.invalidateQueries({ queryKey: ['participantStats'] });
    },
  });
};
