export type UserRoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MISIONERO' | 'PARTICIPANTE';

export const ROLE_LABELS: Record<UserRoleName, string> = {
  SUPER_ADMIN: 'Super admin',
  ADMIN: 'Administrador',
  MISIONERO: 'Misionero',
  PARTICIPANTE: 'Participante',
};

export type UserListItem = {
  _id: string;
  fullName: string;
  name: string;
  lastName?: string;
  phone?: string;
  email: string;
  photo?: string;
  role: UserRoleName;
  date: string;
};

export type UserListResponse = {
  results: UserListItem[];
  totalUSers: number;
  totalPages: number;
  currentPage: number;
  next: number | null;
};

export type RoleOption = {
  name: UserRoleName;
  description: string;
  disabled?: boolean;
};

export type CreateUserPayload = {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRoleName;
};

export type UpdateUserPayload = {
  _id: string;
  name: string;
  lastName?: string;
  phone?: string;
  role: UserRoleName;
};
