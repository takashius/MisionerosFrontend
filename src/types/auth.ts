export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;
export const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'COORDINADOR', 'LOGISTICA'] as const;
export const PAYMENT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'COORDINADOR'] as const;
export const SCAN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'LOGISTICA'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type StaffRole = (typeof STAFF_ROLES)[number];
export type PaymentRole = (typeof PAYMENT_ROLES)[number];
export type ScanRole = (typeof SCAN_ROLES)[number];

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
  isStaff: boolean;
  isLogistics: boolean;
  canConfirmPayment: boolean;
  canScan: boolean;
  homePath: string;
  login: (data: LoginResponse) => void;
  logout: () => void;
};

const toRoles = (role?: string | string[] | null): string[] =>
  Array.isArray(role) ? role : role ? [role] : [];

export const isAdminRole = (role?: string | string[] | null): boolean =>
  toRoles(role).some((item) => ADMIN_ROLES.includes(item as AdminRole));

export const isStaffRole = (role?: string | string[] | null): boolean =>
  toRoles(role).some((item) => STAFF_ROLES.includes(item as StaffRole));

export const isPaymentRole = (role?: string | string[] | null): boolean =>
  toRoles(role).some((item) => PAYMENT_ROLES.includes(item as PaymentRole));

export const isScanRole = (role?: string | string[] | null): boolean =>
  toRoles(role).some((item) => SCAN_ROLES.includes(item as ScanRole));

/** Cuenta solo de puerta: escáner, sin panel de gestión. */
export const isLogisticsRole = (role?: string | string[] | null): boolean =>
  toRoles(role).includes('LOGISTICA') && !isAdminRole(role);

export const staffHomePath = (role?: string | string[] | null): string =>
  isLogisticsRole(role) ? '/escaner' : '/admin';
