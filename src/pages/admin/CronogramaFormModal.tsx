import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { useEffect } from 'react';
import {
  SCHEDULE_TYPES,
  TYPE_LABELS,
  type ScheduleItem,
  type SchedulePayload,
  type ScheduleType,
} from '@app-types/schedule';

type CronogramaFormModalProps = {
  open: boolean;
  editing: ScheduleItem | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: SchedulePayload) => void;
};

const emptyValues = {
  fecha: '2026-09-18',
  horaInicio: '09:00',
  horaFin: '',
  titulo: '',
  tipo: 'formacion' as ScheduleType,
  ponente: '',
  moderador: '',
  descripcion: '',
  notasLogistica: '',
  notasCampaneros: '',
  fichaGuion: '',
  orden: 0,
  publicado: true,
};

const clean = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const toTime = (value?: string | null) => {
  const cleaned = clean(value);
  return cleaned ? cleaned.slice(0, 5) : null;
};

const CronogramaFormModal = ({
  open,
  editing,
  loading,
  onCancel,
  onSubmit,
}: CronogramaFormModalProps) => {
  const [form] = Form.useForm<typeof emptyValues>();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        fecha: editing.fecha,
        horaInicio: editing.horaInicio,
        horaFin: editing.horaFin || '',
        titulo: editing.titulo,
        tipo: editing.tipo,
        ponente: editing.ponente || '',
        moderador: editing.moderador || '',
        descripcion: editing.descripcion || '',
        notasLogistica: editing.notasLogistica || '',
        notasCampaneros: editing.notasCampaneros || '',
        fichaGuion: editing.fichaGuion || '',
        orden: editing.orden ?? 0,
        publicado: editing.publicado !== false,
      });
      return;
    }
    form.setFieldsValue(emptyValues);
  }, [open, editing, form]);

  return (
    <Modal
      open={open}
      title={editing ? 'Editar bloque' : 'Nuevo bloque'}
      okText={editing ? 'Guardar' : 'Crear'}
      cancelText="Cancelar"
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={emptyValues}
        onFinish={(values) => {
          onSubmit({
            fecha: values.fecha,
            horaInicio: toTime(values.horaInicio) || values.horaInicio,
            horaFin: toTime(values.horaFin),
            titulo: values.titulo.trim(),
            tipo: values.tipo,
            ponente: clean(values.ponente),
            moderador: clean(values.moderador),
            descripcion: clean(values.descripcion),
            notasLogistica: clean(values.notasLogistica),
            notasCampaneros: clean(values.notasCampaneros),
            fichaGuion: clean(values.fichaGuion),
            orden: Number(values.orden) || 0,
            publicado: values.publicado !== false,
          });
        }}
      >
        <Form.Item
          name="fecha"
          label="Fecha"
          rules={[{ required: true, message: 'Indica la fecha' }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="horaInicio"
          label="Hora de inicio"
          rules={[{ required: true, message: 'Indica la hora de inicio' }]}
        >
          <Input type="time" />
        </Form.Item>
        <Form.Item name="horaFin" label="Hora de fin">
          <Input type="time" />
        </Form.Item>
        <Form.Item
          name="titulo"
          label="Título"
          rules={[{ required: true, message: 'El título es obligatorio' }]}
        >
          <Input placeholder="Nombre del bloque" />
        </Form.Item>
        <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
          <Select
            options={SCHEDULE_TYPES.map((value) => ({
              value,
              label: TYPE_LABELS[value],
            }))}
          />
        </Form.Item>
        <Form.Item name="ponente" label="Ponente">
          <Input />
        </Form.Item>
        <Form.Item name="moderador" label="Moderador">
          <Input />
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción pública">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="notasLogistica" label="Notas de logística">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="notasCampaneros" label="Notas de campaneros">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="fichaGuion" label="Ficha de guion">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="orden" label="Orden">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="publicado" label="Publicado" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CronogramaFormModal;
