import { useMutation, useQueryClient } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type { Participant } from '@app-types/participants';

export type ScanAction = 'checkin' | 'checkout';

export type ScanValidateResponse = {
  participant: Participant;
  scan: {
    _id: string;
    tipoAccion: ScanAction;
    fechaScan: string;
  };
};

export const useValidateScan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { publicToken: string; accion: ScanAction }) => {
      const { data } = await ERDEAxios.post<ScanValidateResponse>('/scan/validate', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participantList'] });
      queryClient.invalidateQueries({ queryKey: ['participantStats'] });
    },
  });
};
