import { Breadcrumb, Button, Card, Col, Progress, Row, Space, Spin, Typography } from 'antd';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useParticipantStats } from '@api/participants';

const { Title, Text, Paragraph } = Typography;

const percent = (value: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

const Admin = () => {
  const stats = useParticipantStats();
  const data = stats.data;

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
            Control central de inscripciones, conciliación de aportes y validación en puerta para
            Caracas 2026.
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Link to="/registro">
              <Button>Registro público</Button>
            </Link>
            <Link to="/admin/cronograma">
              <Button icon={<CalendarOutlined />}>Cronograma</Button>
            </Link>
            <Link to="/admin/participantes">
              <Button type="primary" icon={<TeamOutlined />}>
                Ver participantes
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      {stats.isLoading && !data ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Text type="secondary">TOTAL INSCRITOS</Text>
              <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
                {data?.inscritos ?? 0}{' '}
                <Text type="secondary">/ {data?.capacidadMaxima ?? 80}</Text>
              </Title>
              <Progress percent={percent(data?.inscritos ?? 0, data?.capacidadMaxima ?? 80)} showInfo={false} />
              <Text type="secondary">Aforo máximo del evento</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Text type="secondary">PAGOS VALIDADOS</Text>
              <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
                {data?.confirmados ?? 0}{' '}
                <Text type="secondary">
                  {Math.max(0, (data?.inscritos ?? 0) - (data?.confirmados ?? 0))} pendientes
                </Text>
              </Title>
              <Progress
                percent={percent(data?.confirmados ?? 0, data?.inscritos || 1)}
                showInfo={false}
                strokeColor="#1E3A8A"
              />
              <Text type="secondary">Confirmados, presentes y con check-out</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Text type="secondary">PLAZAS ALOJAMIENTO</Text>
              <Title level={2} style={{ margin: '8px 0', color: '#00236F' }}>
                {data?.alojamiento ?? 0}{' '}
                <Text type="secondary">/ {data?.plazasAlojamiento ?? 60}</Text>
              </Title>
              <Progress
                percent={percent(data?.alojamiento ?? 0, data?.plazasAlojamiento ?? 60)}
                showInfo={false}
              />
              <Text type="secondary">Solicitudes activas de hospedaje</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Text type="secondary">CHECK-IN EFECTIVO</Text>
              <Title level={2} style={{ margin: '8px 0', color: '#2563EB' }}>
                {data?.presentes ?? 0}
              </Title>
              <Progress
                percent={percent(data?.presentes ?? 0, data?.confirmados || 1)}
                showInfo={false}
              />
              <Text type="secondary">Participantes en sede ahora</Text>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Admin;
