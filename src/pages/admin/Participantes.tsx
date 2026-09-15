import { useState } from 'react';
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  QRCode,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  useConfirmPayment,
  useFixTypo,
  useParticipantList,
  useUpdateLodging,
  useUpdateParticipantStatus,
} from '@api/participants';
import { useAuth } from '@context/useAuth';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import {
  BADGE_STATES,
  PARTICIPANT_STATES,
  PARTICIPANT_TYPES,
  STATE_COLORS,
  STATE_LABELS,
  TYPE_COLORS,
  TYPE_LABELS,
  participantFullName,
  participantInitials,
  type FixTypoPayload,
  type Participant,
  type ParticipantState,
  type ParticipantType,
} from '@app-types/participants';

const { Title, Paragraph, Text } = Typography;

const Participantes = () => {
  const { message } = App.useApp();
  const { canConfirmPayment, canScan } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<ParticipantState | ''>('');
  const [tipo, setTipo] = useState<ParticipantType | ''>('');
  const [paying, setPaying] = useState<Participant | null>(null);
  const [ficha, setFicha] = useState<Participant | null>(null);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [lodging, setLodging] = useState<Participant | null>(null);
  const [qrParticipant, setQrParticipant] = useState<Participant | null>(null);

  const list = useParticipantList({ page, search, estado, tipo });
  const confirmPayment = useConfirmPayment();
  const fixTypo = useFixTypo();
  const updateStatus = useUpdateParticipantStatus();
  const updateLodging = useUpdateLodging();

  const showError = (error: unknown, fallback: string) => {
    if (wasErrorToastShown(error)) return;
    message.error(getApiErrorMessage(error, fallback));
  };

  const columns: ColumnsType<Participant> = [
    {
      title: 'Documento',
      dataIndex: 'documentoId',
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: 'Participante',
      render: (_, row) => (
        <Space>
          <Avatar style={{ background: '#1E3A8A' }}>{participantInitials(row)}</Avatar>
          <span>
            <Text strong>{participantFullName(row)}</Text>
            <br />
            <Text type="secondary">
              {[row.arquidiocesis, row.organizacionComunidad, row.ciudad].filter(Boolean).join(' • ') ||
                '—'}
            </Text>
          </span>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      render: (value: ParticipantType) => <Tag color={TYPE_COLORS[value]}>{TYPE_LABELS[value]}</Tag>,
    },
    {
      title: 'Teléfono',
      dataIndex: 'whatsapp',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Alojamiento',
      render: (_, row) =>
        row.habitacionAsignada || (row.requiereAlojamiento ? 'Por asignar' : 'Externo'),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (value: ParticipantState) => <Tag color={STATE_COLORS[value]}>{STATE_LABELS[value]}</Tag>,
    },
    {
      title: 'Acciones',
      align: 'right',
      render: (_, row) => (
        <Space wrap>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setFicha(row)}>
            Ficha
          </Button>
          {canConfirmPayment && row.estado === 'registrado' && (
            <Button size="small" type="primary" onClick={() => setPaying(row)}>
              Confirmar pago
            </Button>
          )}
          {canScan && (
            <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(row)}>
              Editar
            </Button>
          )}
          <Button size="small" icon={<HomeOutlined />} onClick={() => setLodging(row)}>
            Habitación
          </Button>
          {BADGE_STATES.includes(row.estado) && (
            <Button size="small" icon={<QrcodeOutlined />} onClick={() => setQrParticipant(row)}>
              Ver QR
            </Button>
          )}
          {canConfirmPayment && row.estado === 'registrado' && (
            <Popconfirm
              title="Marcar como no asistirá"
              okText="Confirmar"
              onConfirm={() =>
                updateStatus.mutate(
                  { id: row._id, estado: 'no_asistira' },
                  {
                    onSuccess: () => message.success('Estado actualizado'),
                    onError: (error) => showError(error, 'No se pudo actualizar el estado'),
                  }
                )
              }
            >
              <Button size="small">No asistirá</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[{ title: 'Inicio' }, { title: 'Gestión CEV' }, { title: 'Participantes' }]}
        style={{ marginBottom: 8 }}
      />
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={2} style={{ margin: 0, color: '#00236F' }}>
            Participantes
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Confirmación de pago, corrección tipográfica y seguimiento de acreditación.
          </Paragraph>
        </div>
        <Link to="/registro">
          <Button type="primary">Nuevo registro público</Button>
        </Link>
      </Space>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Buscar por nombre, cédula o comunidad"
            onSearch={(value) => {
              setPage(1);
              setSearch(value);
            }}
            style={{ width: 280 }}
          />
          <Select
            allowClear
            placeholder="Estado"
            style={{ width: 200 }}
            value={estado || undefined}
            onChange={(value) => {
              setPage(1);
              setEstado(value ?? '');
            }}
            options={PARTICIPANT_STATES.map((item) => ({
              value: item,
              label: STATE_LABELS[item],
            }))}
          />
          <Select
            allowClear
            placeholder="Tipo"
            style={{ width: 200 }}
            value={tipo || undefined}
            onChange={(value) => {
              setPage(1);
              setTipo(value ?? '');
            }}
            options={PARTICIPANT_TYPES.map((item) => ({
              value: item,
              label: TYPE_LABELS[item],
            }))}
          />
        </Space>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={list.data?.results ?? []}
          loading={list.isFetching}
          scroll={{ x: 1100 }}
          pagination={{
            current: list.data?.currentPage || page,
            total: list.data?.total || 0,
            pageSize: 10,
            onChange: setPage,
            showTotal: (total) => `${total} participantes`,
          }}
        />
      </Card>

      <PaymentModal
        participant={paying}
        loading={confirmPayment.isPending}
        onCancel={() => setPaying(null)}
        onSubmit={(referenciaComprobante) => {
          if (!paying) return;
          confirmPayment.mutate(
            { id: paying._id, referenciaComprobante },
            {
              onSuccess: () => {
                message.success('Pago confirmado. El QR se envía por correo.');
                setPaying(null);
              },
              onError: (error) => showError(error, 'No se pudo confirmar el pago'),
            }
          );
        }}
      />

      <FichaDrawer participant={ficha} onClose={() => setFicha(null)} />

      <TypoModal
        participant={editing}
        loading={fixTypo.isPending}
        onCancel={() => setEditing(null)}
        onSubmit={(values) => {
          if (!editing) return;
          fixTypo.mutate(
            { id: editing._id, ...values },
            {
              onSuccess: () => {
                message.success('Datos tipográficos actualizados');
                setEditing(null);
              },
              onError: (error) => showError(error, 'No se pudo corregir'),
            }
          );
        }}
      />

      <QrModal participant={qrParticipant} onCancel={() => setQrParticipant(null)} />

      <LodgingModal
        participant={lodging}
        loading={updateLodging.isPending}
        onCancel={() => setLodging(null)}
        onSubmit={(habitacionAsignada) => {
          if (!lodging) return;
          updateLodging.mutate(
            { id: lodging._id, habitacionAsignada },
            {
              onSuccess: () => {
                message.success('Habitación actualizada');
                setLodging(null);
              },
              onError: (error) => showError(error, 'No se pudo asignar la habitación'),
            }
          );
        }}
      />
    </div>
  );
};

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('es-VE');
};

const QrModal = ({
  participant,
  onCancel,
}: {
  participant: Participant | null;
  onCancel: () => void;
}) => {
  const lodging = participant
    ? participant.habitacionAsignada
      ? participant.habitacionAsignada
      : participant.requiereAlojamiento
        ? 'Alojamiento por asignar'
        : 'Sin alojamiento en sede'
    : '';

  return (
    <Modal title="Credencial QR" open={Boolean(participant)} onCancel={onCancel} footer={null} width={440} destroyOnClose>
      {participant && (
        <div className="admin-qr-modal">
          <Avatar size={56} style={{ background: '#1E3A8A' }}>
            {participantInitials(participant)}
          </Avatar>
          <Title level={4} style={{ margin: '12px 0 4px', color: '#00236F' }}>
            {participantFullName(participant)}
          </Title>
          <Space size={6} wrap style={{ justifyContent: 'center' }}>
            <Tag color={TYPE_COLORS[participant.tipo]}>{TYPE_LABELS[participant.tipo]}</Tag>
            <Tag color={STATE_COLORS[participant.estado]}>{STATE_LABELS[participant.estado]}</Tag>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            {participant.documentoId} · {participant.organizacionComunidad}
          </Text>
          <Text type="secondary" style={{ display: 'block' }}>
            {lodging}
          </Text>
          <div className="admin-qr-box">
            <QRCode value={participant.publicToken} size={220} color="#00236F" bordered={false} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Presentar este código en la puerta de acreditación.
          </Text>
        </div>
      )}
    </Modal>
  );
};

const PaymentModal = ({
  participant,
  loading,
  onCancel,
  onSubmit,
}: {
  participant: Participant | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (referencia: string) => void;
}) => {
  const [form] = Form.useForm<{ referenciaComprobante: string }>();

  return (
    <Modal
      title="Confirmar pago y enviar QR"
      open={Boolean(participant)}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okText="Confirmar y enviar QR"
      destroyOnClose
      afterOpenChange={(open) => {
        if (open && participant) {
          form.setFieldsValue({
            referenciaComprobante:
              participant.pagoInscripcion?.referencia ||
              participant.pagoValidado?.referenciaComprobante ||
              '',
          });
        }
      }}
    >
      {participant && (
        <>
          <Paragraph>
            {participantFullName(participant)} · {participant.documentoId}
          </Paragraph>
          {(participant.pagoInscripcion?.titular ||
            participant.pagoInscripcion?.banco ||
            participant.pagoInscripcion?.monto ||
            participant.pagoInscripcion?.comprobanteUrl) && (
            <Descriptions size="small" column={1} style={{ marginBottom: 16 }} bordered>
              {participant.pagoInscripcion?.titular && (
                <Descriptions.Item label="Titular">{participant.pagoInscripcion.titular}</Descriptions.Item>
              )}
              {participant.pagoInscripcion?.banco && (
                <Descriptions.Item label="Banco">{participant.pagoInscripcion.banco}</Descriptions.Item>
              )}
              {participant.pagoInscripcion?.fecha && (
                <Descriptions.Item label="Fecha de pago">
                  {formatDate(participant.pagoInscripcion.fecha)}
                </Descriptions.Item>
              )}
              {participant.pagoInscripcion?.monto && (
                <Descriptions.Item label="Monto">{participant.pagoInscripcion.monto}</Descriptions.Item>
              )}
              {participant.pagoInscripcion?.tasaBcv && (
                <Descriptions.Item label="Tasa BCV">{participant.pagoInscripcion.tasaBcv}</Descriptions.Item>
              )}
              {participant.pagoInscripcion?.comprobanteUrl && (
                <Descriptions.Item label="Comprobante">
                  <a href={participant.pagoInscripcion.comprobanteUrl} target="_blank" rel="noreferrer">
                    Ver archivo
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </>
      )}
      <Form form={form} layout="vertical" onFinish={(values) => onSubmit(values.referenciaComprobante)}>
        <Form.Item
          name="referenciaComprobante"
          label="Referencia del comprobante"
          rules={[{ required: true, message: 'Indica la referencia' }]}
        >
          <Input placeholder="Pago móvil, transferencia o recibo" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const TypoModal = ({
  participant,
  loading,
  onCancel,
  onSubmit,
}: {
  participant: Participant | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: FixTypoPayload) => void;
}) => {
  const [form] = Form.useForm<FixTypoPayload>();

  return (
    <Modal
      title="Corrección tipográfica"
      open={Boolean(participant)}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okText="Guardar"
      destroyOnClose
      afterOpenChange={(open) => {
        if (open && participant) {
          form.setFieldsValue({
            nombres: participant.nombres,
            apellidos: participant.apellidos,
            email: participant.email,
            whatsapp: participant.whatsapp,
            ciudad: participant.ciudad,
            organizacionComunidad: participant.organizacionComunidad,
          });
        }
      }}
    >
      {participant && (
        <Paragraph type="secondary">
          Documento {participant.documentoId} (no editable). El token y el tipo de asistente tampoco
          se modifican aquí.
        </Paragraph>
      )}
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="nombres" label="Nombres" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Correo" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="whatsapp" label="Teléfono">
          <Input />
        </Form.Item>
        <Form.Item name="ciudad" label="Ciudad">
          <Input />
        </Form.Item>
        <Form.Item name="organizacionComunidad" label="Parroquia o comunidad eclesial">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const FichaDrawer = ({
  participant,
  onClose,
}: {
  participant: Participant | null;
  onClose: () => void;
}) => {
  const items = participant
    ? [
        { label: 'Correo', children: participant.email },
        { label: 'Cédula', children: participant.documentoId },
        { label: 'Teléfono', children: participant.whatsapp },
        { label: 'Edad', children: participant.edad },
        { label: 'Fecha de nacimiento', children: formatDate(participant.fechaNacimiento) },
        { label: 'Sexo', children: participant.sexo === 'M' ? 'Masculino' : participant.sexo === 'F' ? 'Femenino' : undefined },
        { label: 'Arquidiócesis', children: participant.arquidiocesis },
        { label: 'Parroquia / comunidad', children: participant.organizacionComunidad },
        { label: 'Ciudad', children: participant.ciudad },
        { label: 'Redes sociales', children: participant.redesSociales },
        { label: 'Estado de vida', children: participant.estadoVida },
        { label: 'Teléfono de emergencia', children: participant.telefonoEmergencia },
        {
          label: 'Alergias o enfermedad',
          children:
            participant.tieneAlergiaEnfermedad === true
              ? participant.alergiasEnfermedadDetalle || 'Sí'
              : participant.tieneAlergiaEnfermedad === false
                ? 'No'
                : undefined,
        },
        { label: 'Titular del pago', children: participant.pagoInscripcion?.titular },
        { label: 'Banco', children: participant.pagoInscripcion?.banco },
        { label: 'Fecha de pago', children: formatDate(participant.pagoInscripcion?.fecha) },
        { label: 'Referencia', children: participant.pagoInscripcion?.referencia },
        { label: 'Monto', children: participant.pagoInscripcion?.monto },
        { label: 'Tasa BCV', children: participant.pagoInscripcion?.tasaBcv },
        {
          label: 'Comprobante',
          children: participant.pagoInscripcion?.comprobanteUrl ? (
            <a href={participant.pagoInscripcion.comprobanteUrl} target="_blank" rel="noreferrer">
              Ver archivo
            </a>
          ) : undefined,
        },
      ].filter((item) => item.children !== undefined && item.children !== '')
    : [];

  return (
    <Drawer
      title={participant ? participantFullName(participant) : 'Ficha'}
      open={Boolean(participant)}
      onClose={onClose}
      width={440}
    >
      {participant && (
        <Descriptions column={1} size="small" bordered items={items} />
      )}
    </Drawer>
  );
};

const LodgingModal = ({
  participant,
  loading,
  onCancel,
  onSubmit,
}: {
  participant: Participant | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (value: string | null) => void;
}) => {
  const [form] = Form.useForm<{ habitacionAsignada?: string }>();

  return (
    <Modal
      title="Asignar habitación"
      open={Boolean(participant)}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okText="Guardar"
      destroyOnClose
      afterOpenChange={(open) => {
        if (open && participant) {
          form.setFieldsValue({ habitacionAsignada: participant.habitacionAsignada ?? '' });
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values.habitacionAsignada?.trim() || null)}
      >
        <Form.Item name="habitacionAsignada" label="Habitación">
          <Input placeholder="CEV Bloque A - Hab. 04" prefix={<CheckCircleOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Participantes;
