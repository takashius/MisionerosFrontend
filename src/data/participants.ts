export type PaymentStatus =
  | 'aprobado'
  | 'checkin'
  | 'exonerado'
  | 'pendiente';

export type ParticipantRole =
  | 'Misionero'
  | 'Coordinador'
  | 'Sacerdote'
  | 'Obispo'
  | 'Ponente';

export type Participant = {
  id: string;
  cedula: string;
  name: string;
  initials: string;
  diocese: string;
  parish: string;
  role: ParticipantRole;
  phone: string;
  lodging: string;
  lodgingOk: boolean;
  payment: PaymentStatus;
  paymentLabel: string;
  passId: string;
};

export const participants: Participant[] = [
  {
    id: '1',
    cedula: 'V-19.482.109',
    name: 'Erick Hernández',
    initials: 'EH',
    diocese: 'Arquidiócesis de Caracas',
    parish: 'La Candelaria',
    role: 'Misionero',
    phone: '+58 412-5550192',
    lodging: 'CEV Bloque A - Hab. 04',
    lodgingOk: true,
    payment: 'aprobado',
    paymentLabel: 'Aprobado',
    passId: 'AMD-2026-0842',
  },
  {
    id: '2',
    cedula: 'V-14.890.334',
    name: 'Milagros De Los Santos',
    initials: 'MS',
    diocese: 'Diócesis de Petare',
    parish: 'Ntra. Sra. del Carmen',
    role: 'Coordinador',
    phone: '+58 424-9128301',
    lodging: 'CEV Bloque B - Hab. 12',
    lodgingOk: true,
    payment: 'checkin',
    paymentLabel: 'Aprobado (Check-in OK)',
    passId: 'AMD-2026-0318',
  },
  {
    id: '3',
    cedula: 'V-11.204.551',
    name: 'Pbro. Carlos Mendoza',
    initials: 'CM',
    diocese: 'Arquidiócesis de Barquisimeto',
    parish: 'Catedral',
    role: 'Sacerdote',
    phone: '+58 414-3019844',
    lodging: 'CEV Casa Sacerdotal',
    lodgingOk: true,
    payment: 'aprobado',
    paymentLabel: 'Aprobado',
    passId: 'AMD-2026-1104',
  },
  {
    id: '4',
    cedula: 'V-8.741.002',
    name: 'Mons. Raúl Fernández',
    initials: 'RF',
    diocese: 'Diócesis de Maracay',
    parish: 'Curia Episcopal',
    role: 'Obispo',
    phone: '+58 412-2299100',
    lodging: 'Suite Episcopal CEV',
    lodgingOk: true,
    payment: 'exonerado',
    paymentLabel: 'Exonerado CEV',
    passId: 'AMD-2026-0001',
  },
  {
    id: '5',
    cedula: 'V-24.118.995',
    name: 'Sofia Andreína Rojas',
    initials: 'SR',
    diocese: 'Arquidiócesis de Valencia',
    parish: 'Pastoral Juvenil',
    role: 'Ponente',
    phone: '+58 416-8831029',
    lodging: 'CEV Bloque A - Hab. 08',
    lodgingOk: true,
    payment: 'aprobado',
    paymentLabel: 'Aprobado',
    passId: 'AMD-2026-2411',
  },
  {
    id: '6',
    cedula: 'V-26.331.408',
    name: 'Juan Pablo Colmenares',
    initials: 'JC',
    diocese: 'Diócesis de Guarenas',
    parish: 'Ntra. Sra. de Copacabana',
    role: 'Misionero',
    phone: '+58 414-7740192',
    lodging: 'Sin Alojamiento (Externo)',
    lodgingOk: false,
    payment: 'pendiente',
    paymentLabel: 'Comprobante Pendiente',
    passId: 'AMD-2026-2633',
  },
  {
    id: '7',
    cedula: 'V-21.554.890',
    name: 'Mariana Betancourt',
    initials: 'MB',
    diocese: 'Arquidiócesis de Caracas',
    parish: 'Chacao',
    role: 'Misionero',
    phone: '+58 424-1123904',
    lodging: 'CEV Bloque B - Hab. 15',
    lodgingOk: true,
    payment: 'aprobado',
    paymentLabel: 'Aprobado',
    passId: 'AMD-2026-2155',
  },
];

export const defaultParticipant = participants[0];

export const normalizeCedula = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

export const findParticipant = (cedula: string) => {
  const needle = normalizeCedula(cedula);
  return participants.find((item) => normalizeCedula(item.cedula) === needle);
};

export const resolveParticipant = (cedula?: string | null): Participant => {
  const trimmed = cedula?.trim();
  if (!trimmed) return defaultParticipant;
  return (
    findParticipant(trimmed) ?? {
      ...defaultParticipant,
      cedula: trimmed,
      passId: `AMD-2026-${normalizeCedula(trimmed).slice(-4) || '0000'}`,
    }
  );
};
