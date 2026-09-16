import type {
  Participant,
  ParticipantFormValues,
  RegisterParticipantPayload,
} from '@app-types/participants';

export const optionalText = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const toDateInput = (value?: string) => {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function participantToFormValues(participant: Participant): ParticipantFormValues {
  return {
    nombres: participant.nombres,
    apellidos: participant.apellidos,
    email: participant.email,
    edad: participant.edad,
    fechaNacimiento: toDateInput(participant.fechaNacimiento),
    sexo: participant.sexo,
    whatsapp: participant.whatsapp,
    telefonoEmergencia: participant.telefonoEmergencia,
    arquidiocesis: participant.arquidiocesis,
    organizacionComunidad: participant.organizacionComunidad,
    redesSociales: participant.redesSociales,
    ciudad: participant.ciudad,
    estadoVida: participant.estadoVida,
    tieneAlergiaEnfermedad: participant.tieneAlergiaEnfermedad,
    alergiasEnfermedadDetalle: participant.alergiasEnfermedadDetalle,
    requiereAlojamiento: participant.requiereAlojamiento !== false,
    pagoTitular: participant.pagoInscripcion?.titular,
    pagoBanco: participant.pagoInscripcion?.banco,
    pagoFecha: toDateInput(participant.pagoInscripcion?.fecha),
    pagoReferencia: participant.pagoInscripcion?.referencia,
    pagoMonto: participant.pagoInscripcion?.monto,
    pagoTasaBcv: participant.pagoInscripcion?.tasaBcv,
  };
}

export function buildParticipantWritePayload(
  values: ParticipantFormValues,
  extra?: { comprobanteUrl?: string; asUpdate?: boolean }
): Omit<RegisterParticipantPayload, 'documentoId' | 'tipo'> &
  Partial<Pick<RegisterParticipantPayload, 'documentoId' | 'tipo'>> {
  const blank = extra?.asUpdate ? null : undefined;
  const payload: Record<string, unknown> = {
    nombres: values.nombres.trim(),
    apellidos: values.apellidos.trim(),
    email: values.email.trim(),
    edad: values.edad ?? blank,
    fechaNacimiento: values.fechaNacimiento
      ? new Date(`${values.fechaNacimiento}T00:00:00`).toISOString()
      : blank,
    sexo: values.sexo ?? blank,
    whatsapp: optionalText(values.whatsapp) ?? blank,
    telefonoEmergencia: optionalText(values.telefonoEmergencia) ?? blank,
    arquidiocesis: optionalText(values.arquidiocesis) ?? blank,
    organizacionComunidad: optionalText(values.organizacionComunidad) ?? blank,
    redesSociales: optionalText(values.redesSociales) ?? blank,
    ciudad: optionalText(values.ciudad) ?? blank,
    estadoVida: optionalText(values.estadoVida) ?? blank,
    tieneAlergiaEnfermedad: values.tieneAlergiaEnfermedad ?? blank,
    alergiasEnfermedadDetalle: optionalText(values.alergiasEnfermedadDetalle) ?? blank,
    requiereAlojamiento: values.requiereAlojamiento !== false,
  };

  if (values.documentoId?.trim()) {
    payload.documentoId = values.documentoId.trim();
  }
  if (values.tipo) {
    payload.tipo = values.tipo;
  }

  const pagoInscripcion = {
    titular: optionalText(values.pagoTitular),
    banco: optionalText(values.pagoBanco),
    fecha: values.pagoFecha ? new Date(`${values.pagoFecha}T00:00:00`).toISOString() : undefined,
    referencia: optionalText(values.pagoReferencia),
    monto: optionalText(values.pagoMonto),
    tasaBcv: optionalText(values.pagoTasaBcv),
    comprobanteUrl: extra?.comprobanteUrl,
  };
  if (extra?.asUpdate || Object.values(pagoInscripcion).some(Boolean)) {
    payload.pagoInscripcion = pagoInscripcion;
  }

  return payload as ReturnType<typeof buildParticipantWritePayload>;
}
