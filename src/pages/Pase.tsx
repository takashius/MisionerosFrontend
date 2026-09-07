import { Avatar, Button, QRCode, Result, Space, Spin, Tag, Typography } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useBadgeByToken } from '@api/participants';
import { readBadgeToken, saveBadgeToken } from '@utils/badgeSession';
import {
  BADGE_STATES,
  STATE_LABELS,
  TYPE_LABELS,
  participantFullName,
  participantInitials,
} from '@app-types/participants';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';

const { Title, Text, Paragraph } = Typography;

const Pase = () => {
  const { token: routeToken } = useParams<{ token: string }>();
  const storedToken = readBadgeToken();
  const token = routeToken || storedToken || undefined;
  const badge = useBadgeByToken(token);

  useEffect(() => {
    if (routeToken) {
      saveBadgeToken(routeToken);
    }
  }, [routeToken]);

  useEffect(() => {
    if (badge.data?.publicToken) {
      saveBadgeToken(badge.data.publicToken);
    }
  }, [badge.data?.publicToken]);

  if (!routeToken && storedToken) {
    return <Navigate to={`/pase/${storedToken}`} replace />;
  }

  if (!token) {
    return (
      <Result
        status="info"
        title="Consulta tu credencial"
        subTitle="Ingresa tu cédula en el portal para abrir el pase digital."
        extra={
          <Link to="/">
            <Button type="primary">Ir al portal</Button>
          </Link>
        }
      />
    );
  }

  if (badge.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (badge.isError || !badge.data) {
    return (
      <Result
        status="warning"
        title="Credencial no disponible"
        subTitle={getApiErrorMessage(
          badge.error,
          'No encontramos un pase confirmado con este enlace.'
        )}
        extra={
          <Link to="/">
            <Button type="primary">Volver al portal</Button>
          </Link>
        }
      />
    );
  }

  const participant = badge.data;
  const lodging = participant.habitacionAsignada
    ? participant.habitacionAsignada
    : participant.requiereAlojamiento
      ? 'Alojamiento por asignar'
      : 'Sin alojamiento en sede';

  return (
    <div className="pase-page">
      <div className="pase-kicker">
        <Tag color="processing">● Acreditación Oficial Digital</Tag>
        <Text type="secondary">Caracas 2026</Text>
      </div>

      <div className="pass-card">
        <div className="pass-banner">
          <div className="pass-banner-row">
            <Tag>Pase Oficial</Tag>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 1 }}>
              CARACAS 2026
            </Text>
          </div>
          <Title level={4} style={{ color: '#fff', margin: '8px 0 0' }}>
            I Asamblea de Misioneros Digitales
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
            Comunión, Misión y Evangelio Digital
          </Text>
        </div>

        <div className="pass-identity">
          <Avatar size={80} style={{ background: '#1E3A8A', fontSize: 28 }}>
            {participantInitials(participant)}
          </Avatar>
          <Title level={3} style={{ margin: '12px 0 4px' }}>
            {participantFullName(participant)}
          </Title>
          <Tag color="blue">{TYPE_LABELS[participant.tipo]}</Tag>
          <Paragraph style={{ marginTop: 8 }}>{participant.organizacionComunidad}</Paragraph>
          <Text type="secondary">{participant.ciudad}</Text>
        </div>

        <div className="pass-qr">
          <QRCode value={participant.publicToken} size={196} color="#00236F" bordered={false} />
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
            Código de acceso único para entrada a ponencias y comedor
          </Text>
          <Tag
            icon={<CheckCircleOutlined />}
            color={BADGE_STATES.includes(participant.estado) ? 'success' : 'default'}
            style={{ marginTop: 12 }}
          >
            {STATE_LABELS[participant.estado]}
            {participant.habitacionAsignada ? ' • Alojamiento incluido' : ''}
          </Tag>
        </div>

        <div className="pass-secure">
          <Text>
            <SafetyCertificateOutlined /> Token de acreditación
          </Text>
          <Text strong style={{ color: '#00236F' }}>
            Válido Sept 2026
          </Text>
        </div>
      </div>

      <div className="pass-logistics">
        <Title level={5} style={{ color: '#00236F' }}>
          Logística y Recepción
        </Title>
        <Space align="start">
          <CalendarOutlined style={{ color: '#2563EB', fontSize: 18 }} />
          <span>
            <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
              FECHA
            </Text>
            <Text strong>18–20 Septiembre 2026</Text>
          </span>
        </Space>
        <Space align="start" style={{ marginTop: 12 }}>
          <EnvironmentOutlined style={{ color: '#2563EB', fontSize: 18 }} />
          <span>
            <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
              SEDE DEL EVENTO
            </Text>
            <Text>Sede Conferencia Episcopal Venezolana (CEV), Montalbán</Text>
          </span>
        </Space>
        <Space align="start" style={{ marginTop: 12 }}>
          <HomeOutlined style={{ color: '#2563EB', fontSize: 18 }} />
          <span>
            <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
              ALOJAMIENTO
            </Text>
            <Text>{lodging}</Text>
          </span>
        </Space>
      </div>

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }} size={10}>
        <Link to="/programa">
          <Button block>Ver Programa</Button>
        </Link>
      </Space>
    </div>
  );
};

export default Pase;
