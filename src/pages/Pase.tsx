import { useMemo } from 'react';
import { Avatar, Button, QRCode, Space, Tag, Typography, App } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { resolveParticipant } from '../data/participants';

const { Title, Text, Paragraph } = Typography;

const Pase = () => {
  const { message } = App.useApp();
  const [params] = useSearchParams();
  const participant = useMemo(
    () => resolveParticipant(params.get('cedula')),
    [params],
  );

  return (
    <div className="pase-page">
      <div className="pase-kicker">
        <Tag color="processing">● Acreditación Oficial Digital</Tag>
        <Text type="secondary">ID: #{participant.passId} • Caracas 2026</Text>
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
            {participant.initials}
          </Avatar>
          <Title level={3} style={{ margin: '12px 0 4px' }}>
            {participant.name}
          </Title>
          <Tag color="blue">{participant.role === 'Misionero' ? 'Misionero Digital' : participant.role}</Tag>
          <Paragraph style={{ marginTop: 8 }}>
            {participant.diocese}
          </Paragraph>
        </div>

        <div className="pass-qr">
          <QRCode
            value={`misioneros://pass/${participant.passId}`}
            size={196}
            color="#00236F"
            bordered={false}
          />
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
            Código de acceso único para entrada a ponencias y comedor
          </Text>
          <Tag icon={<CheckCircleOutlined />} color="success" style={{ marginTop: 12 }}>
            Confirmado{participant.lodgingOk ? ' • Alojamiento incluido' : ''}
          </Tag>
        </div>

        <div className="pass-secure">
          <Text>
            <SafetyCertificateOutlined /> Token Dinámico Seguro
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
      </div>

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }} size={10}>
        <Button
          type="primary"
          block
          icon={<DownloadOutlined />}
          onClick={() => message.success('Carnet generado (demo)')}
        >
          Descargar Carnet
        </Button>
        <Link to="/programa">
          <Button block>Ver Programa</Button>
        </Link>
        <Button type="link" icon={<WalletOutlined />} block>
          Añadir a Google Wallet / Apple Wallet
        </Button>
      </Space>
    </div>
  );
};

export default Pase;
