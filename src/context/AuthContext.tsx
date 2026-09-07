import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContextInstance';
import { isAdminRole, type AuthUser, type LoginResponse } from '@app-types/auth';

const readUser = (): AuthUser | null => {
  const raw = localStorage.getItem('UserData');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const readRoles = (): string[] => {
  const raw = localStorage.getItem('Roles');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(readUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('Token'));

  const login = useCallback((userData: LoginResponse) => {
    const { token: sessionToken, ...rest } = userData;
    setUser(rest);
    setToken(sessionToken);
    localStorage.setItem('Token', sessionToken);
    localStorage.setItem('Roles', JSON.stringify(rest.role ?? []));
    localStorage.setItem('UserData', JSON.stringify(rest));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('Token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('Roles');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin: isAdminRole(user?.role ?? readRoles()),
      login,
      logout,
    }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
