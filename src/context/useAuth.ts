import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';
import type { AuthContextType } from '@app-types/auth';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
