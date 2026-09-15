import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  IdcardOutlined,
  LockOutlined,
  MessageOutlined,
  PhoneOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  SearchOutlined,
  TeamOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import { useLookupParticipant } from '@api/participants';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import AdminLoginForm from '@components/AdminLoginForm';
import { clearBadgeToken, saveBadgeToken } from '@utils/badgeSession';
import { CONTACT_PHONE_LOCAL, CONTACT_PHONE_TEL, CONTACT_WHATSAPP_URL } from '@data/contact';
import logo from '../assets/logo.svg';

const { Title, Paragraph, Text } = Typography;

const Portal = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { isStaff, isLogistics, homePath } = useAuth();
  const screens = Grid.useBreakpoint();
  const [helpOpen, setHelpOpen] = useState(false);
  const lookup = useLookupParticipant();

  useEffect(() => {
    clearBadgeToken();
  }, []);

  const onAttendee = ({ cedula }: { cedula: string }) => {
    lookup.mutate(cedula.trim(), {
      onSuccess: (badge) => {
        saveBadgeToken(badge.publicToken);
        navigate(`/pase/${badge.publicToken}`);
      },
      onError: (error) => {
        if (wasErrorToastShown(error)) return;
        message.error(
          getApiErrorMessage(
            error,
            'No encontramos una credencial confirmada con ese documento.'
          )
        );
      },
    });
  };

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <Tag className="hero-pill" icon={<CalendarOutlined />} color="blue">
          <span>18 al 20 de septiembre 2026</span>
          <span>Caracas · Sede CEV Montalbán</span>
        </Tag>
        <img src={logo} alt="" width={56} height={56} className="hero-emblem" />
        <Title level={1} className="hero-title">
          Portal de Acceso y Acreditación
        </Title>
        <Paragraph className="hero-lead">
          Bienvenido a la plataforma central de la I Asamblea de Misioneros
          Digitales. Selecciona tu perfil de usuario para validar tu credencial
          sinodal o gestionar accesos.
        </Paragraph>
        <Row gutter={[16, 16]} className="metrics-bar">
          <Col xs={24} md={8}>
            <Space>
              <span className="metric-icon">
                <TeamOutlined />
              </span>
              <span>
                <Text strong>Hasta 80 plazas</Text>{' '}
                <Tag color="processing">Aforo limitado</Tag>
                <br />
                <Text type="secondary">60 cupos estimados de hospedaje</Text>
              </span>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <span className="metric-icon">
                <HomeOutlined />
              </span>
              <span>
                <Text strong>Sede CEV Montalbán</Text>
                <br />
                <Text type="secondary">Salón San Juan Pablo II & Capilla</Text>
              </span>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <span className="metric-icon">
                <PhoneOutlined />
              </span>
              <span>
                <a href={`tel:${CONTACT_PHONE_TEL}`} style={{ color: 'inherit' }}>
                  <Text strong>{CONTACT_PHONE_LOCAL}</Text>
                </a>
                <br />
                <Text type="secondary">Mesa Técnica Pastoral WhatsApp</Text>
              </span>
            </Space>
          </Col>
        </Row>
      </section>

      <Row gutter={[24, 24]} className="portal-cards">
        <Col xs={24} lg={8}>
          <Card className="access-card" bordered={false}>
            <div className="card-top">
              <Tag color="blue">Acceso Asistentes</Tag>
              <Text type="success">● Activo</Text>
            </div>
            <Space align="start" size={12} style={{ marginBottom: 12 }}>
              <span className="card-icon navy">
                <IdcardOutlined />
              </span>
              <span>
                <Title level={4} style={{ margin: 0 }}>
                  Consultar Pase Digital
                </Title>
                <Text type="secondary">Credencial Canónica y QR</Text>
              </span>
            </Space>
            <Paragraph type="secondary">
              Presenta o descarga tu credencial oficial con QR dinámico para
              acceso al plenario, habitaciones en residencia episcopal y comedor.
            </Paragraph>
            <Form layout="vertical" onFinish={onAttendee}>
              <Form.Item
                name="cedula"
                label="Cédula de Identidad o Pasaporte"
                rules={[{ required: true, message: 'Ingresa tu cédula' }]}
              >
                <Input
                  size="large"
                  prefix={<SearchOutlined />}
                  placeholder="ej. V-19482109"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                icon={<QrcodeOutlined />}
                loading={lookup.isPending}
              >
                Ver Mi Credencial
              </Button>
            </Form>
            <Button
              block
              style={{ marginTop: 8 }}
              onClick={() => navigate('/registro')}
            >
              Inscribirme a la asamblea
            </Button>
            <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12 }}>
              El pase solo aparece cuando el pago ya fue confirmado.
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="access-card" bordered={false}>
            <div className="card-top">
              <Tag>Control de Acceso</Tag>
              <Text>
                <WifiOutlined /> Sincronizado
              </Text>
            </div>
            <Space align="start" size={12} style={{ marginBottom: 12 }}>
              <span className="card-icon teal">
                <ScanOutlined />
              </span>
              <span>
                <Title level={4} style={{ margin: 0 }}>
                  Terminal de Escaneo
                </Title>
                <Text type="secondary">Recepción & Puertas CEV</Text>
              </span>
            </Space>
            <Paragraph type="secondary">
              Módulo para comisiones de logística, check-in vehicular, control de
              salón y comedor. Validación veloz en menos de 400 milisegundos.
            </Paragraph>
            <div className="scanner-preview">
              <ScanOutlined style={{ fontSize: 32, color: '#2563EB' }} />
              <Title level={5} style={{ margin: '8px 0 4px' }}>
                Cámara Lista
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                Apunta el lente al gafete o dispositivo del misionero.
              </Paragraph>
              <Button type="primary" block icon={<ScanOutlined />} onClick={() => navigate('/escaner')}>
                Iniciar Escáner de Entrada
              </Button>
            </div>
            <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12 }}>
              Terminal ID: CEV-GATE-01
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="access-card" bordered={false}>
            <div className="card-top">
              <Tag color="geekblue">Gestión CEV</Tag>
              <Text type="secondary">
                <LockOutlined /> Restringido
              </Text>
            </div>
            <Space align="start" size={12} style={{ marginBottom: 12 }}>
              <span className="card-icon muted">
                <SafetyCertificateOutlined />
              </span>
              <span>
                <Title level={4} style={{ margin: 0 }}>
                  Panel Directivo
                </Title>
                <Text type="secondary">Comisión Episcopal</Text>
              </span>
            </Space>
            <Paragraph type="secondary">
              Administración de comisiones, balances de aportes eclesiásticos,
              asignación de hospedajes, salas temáticas y reportes para obispos.
            </Paragraph>
            {isStaff ? (
              <Button type="primary" block onClick={() => navigate(homePath)}>
                {isLogistics ? 'Ir al escáner' : 'Ir al Dashboard'}
              </Button>
            ) : (
              <AdminLoginForm />
            )}
            <Text type="secondary" style={{ display: 'block', marginTop: 16, fontSize: 12 }}>
              Autenticación con doble factor (2FA) requerida para la Curia.
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="portal-bento">
        <Col xs={24} md={16}>
          <Card className="venue-card" bordered={false}>
            <div className="venue-visual">
              <Text className="venue-kicker">Sede Principal</Text>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                Conferencia Episcopal Venezolana
              </Title>
            </div>
            <div className="venue-copy">
              <Tag icon={<EnvironmentOutlined />} color="blue">
                Montalbán II, Caracas
              </Tag>
              <Title level={4} style={{ color: '#00236F', marginTop: 12 }}>
                Espacio de Comunión & Redes
              </Title>
              <Paragraph type="secondary">
                Equipado con fibra simétrica de alta velocidad, traducción
                simultánea y cabinas para transmisiones diocesanas de radio y
                podcast pastoral.
              </Paragraph>
              <Row gutter={12}>
                <Col span={12}>
                  <div className="mini-stat">
                    <Text type="secondary">Capilla Adoración</Text>
                    <Title level={5} style={{ margin: 0, color: '#00236F' }}>
                      24 Horas
                    </Title>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mini-stat">
                    <Text type="secondary">Red de Cobertura</Text>
                    <Title level={5} style={{ margin: 0, color: '#00236F' }}>
                      Wi-Fi 6 CEV
                    </Title>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="quote-card" bordered={false}>
            <Paragraph className="quote-text">
              “El continente digital no es una herramienta utilitaria, sino un
              territorio de misión donde la Iglesia está llamada a sembrar
              fraternidad y esperanza.”
            </Paragraph>
            <Text strong style={{ color: '#fff', display: 'block' }}>
              Papa Francisco
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)' }}>
              Mensaje para las Comunicaciones Sociales
            </Text>
          </Card>
        </Col>
      </Row>

      <Card className="help-strip" bordered={false}>
        <Space
          direction={screens.md ? 'horizontal' : 'vertical'}
          style={{ width: '100%', justifyContent: 'space-between' }}
          size="large"
        >
          <Space align="start" size={16}>
            <span className="card-icon navy">
              <PhoneOutlined />
            </span>
            <span>
              <Title level={4} style={{ margin: 0 }}>
                ¿Necesitas ayuda con tu traslado o pasaje interdiocesano?
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                El equipo de acogida de la CEV está activo atendiendo solicitudes
                de acreditación y hospedaje.
              </Paragraph>
            </span>
          </Space>
          <Space wrap>
            <Button onClick={() => setHelpOpen(true)}>Preguntas Frecuentes</Button>
            <Button
              type="primary"
              icon={<MessageOutlined />}
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Asistencia
            </Button>
          </Space>
        </Space>
      </Card>

      <footer className="portal-footer">
        <Space direction="vertical" size={4}>
          <Text strong style={{ color: '#00236F' }}>
            <CheckCircleOutlined /> Conferencia Episcopal Venezolana
          </Text>
          <Text type="secondary">
            Comisión Episcopal de Comunicación e Innovación Pastoral. Evento
            eclesial oficial con aval de la CEV.
          </Text>
        </Space>
        <Text type="secondary">
          © 2026 I Asamblea de Misioneros Digitales Caracas. Todos los derechos
          reservados.
        </Text>
      </footer>

      <Modal
        title="Acreditación presencial"
        open={helpOpen}
        onCancel={() => setHelpOpen(false)}
        footer={null}
      >
        <Paragraph>
          Horarios de acreditación presencial en la CEV: viernes 18 de septiembre
          desde las 8:00 AM. Lugar: Puerta Principal, Montalbán.
        </Paragraph>
      </Modal>
    </div>
  );
};

export default Portal;
