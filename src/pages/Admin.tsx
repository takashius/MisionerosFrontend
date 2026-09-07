import { useMemo, useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Segmented,
  Space,
  Table,
  Tag,
  Typography,
  App,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { participants, type Participant, type PaymentStatus } from '../data/participants';

const { Title, Text, Paragraph } = Typography;

const paymentColor: Record<PaymentStatus, string> = {
  aprobado: 'blue',
  checkin: 'geekblue',
  exonerado: 'purple',
  pendiente: 'red',
};

const roleColor: Record<Participant['role'], string> = {
  Misionero: 'blue',
  Coordinador: 'cyan',
  Sacerdote: 'geekblue',
  Obispo: 'purple',
  Ponente: 'processing',
};

const Admin = () => {
  const { message } = App.useApp();
  const [filter, setFilter] = useState('todos');

  const data = useMemo(() => {
    if (filter === 'checkin') return participants.filter((item) => item.payment === 'checkin');
    if (filter === 'pendiente') return participants.filter((item) => item.payment === 'pendiente');
    return participants;
  }, [filter]);

  const columns: ColumnsType<Participant> = [
    {
      title: 'Cédula / DNI',
      dataIndex: 'cedula',
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: 'Participante',
      render: (_, row) => (
        <Space>
          <Avatar style={{ background: '#1E3A8A' }}>{row.initials}</Avatar>
          <span>
            <Text strong>{row.name}</Text>
            <br />
            <Text type="secondary">
              {row.diocese} • {row.parish}
            </Text>
          </span>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      render: (role: Participant['role']) => <Tag color={roleColor[role]}>{role}</Tag>,
    },
    {
      title: 'WhatsApp',
      dataIndex: 'phone',
    },
    {
      title: 'Alojamiento',
      render: (_, row) => (
        <Text type={row.lodgingOk ? undefined : 'danger'}>
          {row.lodgingOk ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {row.lodging}
        </Text>
      ),
    },
    {
      title: 'Estado de pago',
      render: (_, row) => <Tag color={paymentColor[row.payment]}>{row.paymentLabel}</Tag>,
    },
    {
      title: 'Acciones',
      align: 'right',
      render: (_, row) => (
        <Link to={`/pase?cedula=${encodeURIComponent(row.cedula)}`}>
          <Button size="small" icon={<QrcodeOutlined />}>
            Ver QR
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: 'Inicio' },
          { title: 'Gestión del Evento' },
          { title: 'Participantes y Acreditación' },
        ]}
        style={{ marginBottom: 8 }}
      />
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#00236F' }}>
            Panel de Gestión y Acreditación
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Control central de inscripciones, conciliación de aportes y validación en puerta para Caracas 2026.
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => message.info('Exportación demo')}>
              Exportar Excel (.xlsx)
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Alta de participantes próximamente')}>
              Registrar Nuevo Participante
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">TOTAL INSCRITOS</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
              65 <Text type="secondary">/ 80</Text>
            </Title>
            <Progress percent={81} showInfo={false} />
            <Text type="secondary">+12 en lista de espera regional</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">PAGOS VALIDADOS</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
              58 <Tag color="red">7 pendientes</Tag>
            </Title>
            <Progress percent={90} showInfo={false} strokeColor="#1E3A8A" />
            <Text type="secondary">Banco Mercantil • Pagomóvil CEV</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">PLAZAS ALOJAMIENTO</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
              52 <Text type="secondary">/ 60</Text>
            </Title>
            <Progress percent={87} showInfo={false} />
            <Text type="secondary">8 camas disponibles en Bloque B</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Text type="secondary">CHECK-IN EFECTIVO</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#2563EB' }}>
              41
            </Title>
            <Progress percent={51} showInfo={false} />
            <Text type="secondary">Último ingreso hace 3 min (Torniquete 1)</Text>
          </Card>
        </Col>
      </Row>

      <Card>
        <Segmented
          value={filter}
          onChange={(value) => setFilter(String(value))}
          options={[
            { label: 'Todos (65)', value: 'todos' },
            { label: 'Check-in Realizado (41)', value: 'checkin' },
            { label: 'Pago Pendiente (7)', value: 'pendiente' },
          ]}
          style={{ marginBottom: 16 }}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} participantes` }}
          scroll={{ x: 980 }}
        />
      </Card>
    </div>
  );
};

export default Admin;
