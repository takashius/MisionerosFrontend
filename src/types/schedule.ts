export const SCHEDULE_TYPES = [
  'comida',
  'liturgia',
  'formacion',
  'dinamica',
  'mesa',
  'panel',
  'recreo',
  'otro',
] as const;

export type ScheduleType = (typeof SCHEDULE_TYPES)[number];

export type ScheduleItem = {
  _id: string;
  fecha: string;
  horaInicio: string;
  horaFin?: string | null;
  titulo: string;
  tipo: ScheduleType;
  ponente?: string | null;
  moderador?: string | null;
  descripcion?: string | null;
  notasLogistica?: string | null;
  notasCampaneros?: string | null;
  fichaGuion?: string | null;
  orden: number;
  publicado?: boolean;
};

export type SchedulePayload = Omit<ScheduleItem, '_id'>;

export const TYPE_LABELS: Record<ScheduleType, string> = {
  comida: 'Comida',
  liturgia: 'Liturgia',
  formacion: 'Formación',
  dinamica: 'Dinámica',
  mesa: 'Mesa de trabajo',
  panel: 'Panel',
  recreo: 'Recreo',
  otro: 'Otro',
};

export const TYPE_COLORS: Record<ScheduleType, string> = {
  comida: 'gold',
  liturgia: 'purple',
  formacion: 'blue',
  dinamica: 'cyan',
  mesa: 'geekblue',
  panel: 'processing',
  recreo: 'green',
  otro: 'default',
};

export const DAY_LABELS: Record<string, string> = {
  '2026-09-18': 'Viernes 18 de septiembre',
  '2026-09-19': 'Sábado 19 de septiembre',
  '2026-09-20': 'Domingo 20 de septiembre',
};

export const formatDayLabel = (fecha: string) => {
  if (DAY_LABELS[fecha]) return DAY_LABELS[fecha];
  const [year, month, day] = fecha.split('-').map(Number);
  if (!year || !month || !day) return fecha;
  return new Date(year, month - 1, day).toLocaleDateString('es-VE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

export const groupByFecha = (items: ScheduleItem[]) => {
  const groups = new Map<string, ScheduleItem[]>();
  items.forEach((item) => {
    const list = groups.get(item.fecha) ?? [];
    list.push(item);
    groups.set(item.fecha, list);
  });
  return Array.from(groups.entries());
};
