import { createContext } from 'react';
import type { AuthContextType } from '@app-types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
