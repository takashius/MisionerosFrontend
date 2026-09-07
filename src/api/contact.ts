import { useMutation } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';

export type ContactPayload = {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
};

export const useSendContact = () =>
  useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const { data } = await ERDEAxios.post('/contact', payload);
      return data as { received: boolean };
    },
  });
