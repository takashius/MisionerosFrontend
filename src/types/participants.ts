export const PARTICIPANT_TYPES = [
  'misionero',
  'coordinador',
  'ponente',
  'sacerdote',
  'obispo',
] as const;

export type ParticipantType = (typeof PARTICIPANT_TYPES)[number];

export const PARTICIPANT_STATES = [
  'registrado',
  'confirmado',
  'cancelado',
  'no_asistira',
  'checkin_realizado',
  'checkout_realizado',
] as const;

export type ParticipantState = (typeof PARTICIPANT_STATES)[number];

export type Sexo = 'M' | 'F';

export type PagoValidado = {
  validado: boolean;
  validadoPor?: string;
  fechaValidacion?: string;
  referenciaComprobante?: string;
};

export type Participant = {
  _id: string;
  publicToken: string;
  nombres: string;
  apellidos: string;
  documentoId: string;
  fechaNacimiento?: string;
  sexo?: Sexo;
  whatsapp: string;
  email: string;
  ciudad: string;
  organizacionComunidad: string;
  tipo: ParticipantType;
  estado: ParticipantState;
  requiereAlojamiento: boolean;
  habitacionAsignada?: string | null;
  pagoValidado: PagoValidado;
  comunicaciones: {
    qrEnviadoEmail: boolean;
    qrEnviadoWhatsApp: boolean;
  };
  createdAt?: string;
};

export type BadgeParticipant = {
  publicToken: string;
  nombres: string;
  apellidos: string;
  documentoId: string;
  tipo: ParticipantType;
  estado: ParticipantState;
  organizacionComunidad: string;
  ciudad: string;
  requiereAlojamiento: boolean;
  habitacionAsignada?: string | null;
};

export type ParticipantStats = {
  inscritos: number;
  capacidadMaxima: number;
  confirmados: number;
  presentes: number;
  alojamiento: number;
  plazasAlojamiento: number;
};

export type ParticipantListResponse = {
  results: Participant[];
  total: number;
  totalPages: number;
  currentPage: number;
  next: number | null;
};

export type RegisterParticipantPayload = {
  nombres: string;
  apellidos: string;
  documentoId: string;
  fechaNacimiento: string;
  sexo: Sexo;
  whatsapp: string;
  email: string;
  ciudad: string;
  organizacionComunidad: string;
  tipo: ParticipantType;
  requiereAlojamiento: boolean;
};

export type FixTypoPayload = {
  nombres?: string;
  apellidos?: string;
  email?: string;
  whatsapp?: string;
  ciudad?: string;
  organizacionComunidad?: string;
};

export type ParticipantListParams = {
  page: number;
  search?: string;
  estado?: ParticipantState | '';
  tipo?: ParticipantType | '';
};

export const TYPE_LABELS: Record<ParticipantType, string> = {
  misionero: 'Misionero digital',
  coordinador: 'Coordinador',
  ponente: 'Ponente',
  sacerdote: 'Sacerdote',
  obispo: 'Obispo',
};

export const STATE_LABELS: Record<ParticipantState, string> = {
  registrado: 'Registrado',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  no_asistira: 'No asistirá',
  checkin_realizado: 'Check-in realizado',
  checkout_realizado: 'Check-out realizado',
};

export const TYPE_COLORS: Record<ParticipantType, string> = {
  misionero: 'blue',
  coordinador: 'cyan',
  ponente: 'processing',
  sacerdote: 'geekblue',
  obispo: 'purple',
};

export const STATE_COLORS: Record<ParticipantState, string> = {
  registrado: 'gold',
  confirmado: 'blue',
  cancelado: 'default',
  no_asistira: 'default',
  checkin_realizado: 'green',
  checkout_realizado: 'geekblue',
};

export const BADGE_STATES: ParticipantState[] = [
  'confirmado',
  'checkin_realizado',
  'checkout_realizado',
];

export const participantFullName = (item: { nombres: string; apellidos: string }) =>
  `${item.nombres} ${item.apellidos}`.trim();

export const participantInitials = (item: { nombres: string; apellidos: string }) =>
  `${item.nombres?.[0] ?? ''}${item.apellidos?.[0] ?? ''}`.toUpperCase() || 'P';
