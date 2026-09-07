import { useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Modal,
  Segmented,
  Space,
  Tag,
  Typography,
  App,
} from 'antd';
import {
  CheckCircleOutlined,
  IdcardOutlined,
  LoginOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { resolveParticipant, participants, type Participant } from '../data/participants';

const { Title, Text, Paragraph } = Typography;

const Escaner = () => {
  const { message } = App.useApp();
  const [mode, setMode] = useState<'entrada' | 'salida'>('entrada');
  const [scanned, setScanned] = useState<Participant>(participants[1]);
  const [manualOpen, setManualOpen] = useState(false);
  const [cedula, setCedula] = useState('');
  const [checked, setChecked] = useState(false);

  const confirm = () => {
    setChecked(true);
    message.success(mode === 'entrada' ? 'Ingreso exitoso' : 'Salida registrada');
    window.setTimeout(() => setChecked(false), 1800);
  };

  const searchManual = () => {
    const found = findParticipant(cedula);
    if (!found) {
      message.warning('No hay acreditación con esa cédula');
      return;
    }
    setScanned(found);
    setManualOpen(false);
    setCedula('');
  };

  return (
    <div className="scanner-page">
      <div className="scanner-top">
        <div>
          <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Logística Caracas 2026
          </Text>
          <Title level={4} style={{ margin: 0 }}>
            Puerta Principal • Acreditación
          </Title>
        </div>
        <Tag color="processing">42 / 80</Tag>
      </div>

      <div className="scanner-controls">
        <Segmented
          value={mode}
          onChange={(value) => setMode(value as 'entrada' | 'salida')}
          options={[
            { label: 'Entrada', value: 'entrada', icon: <LoginOutlined /> },
            { label: 'Salida', value: 'salida', icon: <LogoutOutlined /> },
          ]}
        />
      </div>

      <div className="viewfinder">
        <div className="reticle" />
        <div className="scan-line" />
        <span className="viewfinder-hint">Alinee el código QR del carnet dentro del marco</span>
      </div>

      <div className="scan-result">
        <div className="scan-result-head">
          <Tag icon={<CheckCircleOutlined />} color="success">
            Acreditación Válida
          </Tag>
          <Text type="secondary">ID: #{scanned.passId}</Text>
        </div>
        <Space align="start" size={12}>
          <Avatar shape="square" size={56} style={{ background: '#1E3A8A' }}>
            {scanned.initials}
          </Avatar>
          <span>
            <Title level={5} style={{ margin: 0 }}>
              {scanned.name}
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              {scanned.diocese} • {scanned.parish}
            </Paragraph>
            <Space size={6} wrap style={{ marginTop: 6 }}>
              <Tag color="blue">{scanned.role}</Tag>
              <Tag>{scanned.lodging}</Tag>
            </Space>
          </span>
        </Space>
        <Button
          type="primary"
          block
          size="large"
          icon={checked ? <CheckCircleOutlined /> : <ThunderboltOutlined />}
          onClick={confirm}
          style={{ marginTop: 12 }}
        >
          {checked
            ? mode === 'entrada'
              ? '¡Ingreso Exitoso!'
              : '¡Salida Registrada!'
            : mode === 'entrada'
              ? 'Completar Ingreso de Asistente'
              : 'Registrar Salida'}
        </Button>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12 }}>
          Último registro previo: hace 2 mins (Puerta Lateral)
        </Text>
      </div>

      <Button block icon={<IdcardOutlined />} onClick={() => setManualOpen(true)}>
        Búsqueda Manual por Cédula / DNI
      </Button>

      <Modal
        title="Búsqueda por cédula"
        open={manualOpen}
        onCancel={() => setManualOpen(false)}
        onOk={searchManual}
        okText="Buscar"
      >
        <Input
          placeholder="V-14.890.334"
          value={cedula}
          onChange={(event) => setCedula(event.target.value)}
          onPressEnter={searchManual}
        />
      </Modal>
    </div>
  );
};

export default Escaner;
