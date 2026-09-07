export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export type LoginResponse = {
  _id: string;
  name: string;
  lastName?: string;
  photo?: string;
  email: string;
  date?: string;
  role: string[];
  isFirstLogin?: boolean;
  token: string;
};

export type AuthUser = Omit<LoginResponse, 'token'>;

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
};

export const isAdminRole = (role?: string | string[] | null): boolean => {
  const roles = Array.isArray(role) ? role : role ? [role] : [];
  return roles.some((item) => ADMIN_ROLES.includes(item as AdminRole));
};
