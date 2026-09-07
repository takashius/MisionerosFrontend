import { useRef, useState } from 'react';
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
  CloseCircleOutlined,
  IdcardOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useParticipantByDocument, useParticipantStats } from '@api/participants';
import { useValidateScan, type ScanAction } from '@api/scans';
import { extractPublicToken } from '@utils/extractPublicToken';
import { playScanTone } from '@utils/scanFeedback';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import QrCamera from '@components/QrCamera';
import {
  STATE_LABELS,
  TYPE_LABELS,
  participantFullName,
  participantInitials,
  type Participant,
} from '@app-types/participants';

const { Title, Text, Paragraph } = Typography;

const Escaner = () => {
  const { message } = App.useApp();
  const [mode, setMode] = useState<ScanAction>('checkin');
  const [scanned, setScanned] = useState<Participant | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [statusText, setStatusText] = useState('Apunta el QR de la credencial');
  const [manualOpen, setManualOpen] = useState(false);
  const [cedula, setCedula] = useState('');
  const [cameraOn, setCameraOn] = useState(true);
  const busyRef = useRef(false);
  const modeRef = useRef<ScanAction>('checkin');
  const stats = useParticipantStats();
  const validate = useValidateScan();
  const byDocument = useParticipantByDocument();
  const validateRef = useRef(validate.mutateAsync);

  modeRef.current = mode;
  validateRef.current = validate.mutateAsync;

  const runValidate = async (publicToken: string) => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const result = await validateRef.current({
        publicToken,
        accion: modeRef.current,
      });
      setScanned(result.participant);
      setScanStatus('ok');
      const text = modeRef.current === 'checkin' ? 'Check-in registrado' : 'Check-out registrado';
      setStatusText(text);
      playScanTone(true);
      message.success(text);
    } catch (error) {
      const text = getApiErrorMessage(
        error,
        modeRef.current === 'checkin' ? 'No se pudo hacer el check-in' : 'No se pudo hacer el check-out'
      );
      playScanTone(false);
      setScanStatus('error');
      setStatusText(text);
      if (!wasErrorToastShown(error)) {
        message.error(text);
      }
    } finally {
      window.setTimeout(() => {
        busyRef.current = false;
      }, 1600);
    }
  };

  const onDecode = (decoded: string) => {
    setCameraOn(false);
    const token = extractPublicToken(decoded);
    if (!token) {
      playScanTone(false);
      setScanStatus('error');
      setStatusText('El QR no contiene un token válido');
      return;
    }
    void runValidate(token);
  };

  const startCamera = () => {
    busyRef.current = false;
    setScanStatus('idle');
    setStatusText('Apunta el QR de la credencial');
    setCameraOn(true);
  };

  const searchManual = async () => {
    if (!cedula.trim()) return;
    try {
      const participant = await byDocument.mutateAsync(cedula.trim());
      setManualOpen(false);
      setCedula('');
      setCameraOn(false);
      setScanned(participant);
      await runValidate(participant.publicToken);
    } catch (error) {
      if (!wasErrorToastShown(error)) {
        message.error(getApiErrorMessage(error, 'No encontramos ese documento'));
      }
    }
  };

  const lodging = scanned?.habitacionAsignada
    ? scanned.habitacionAsignada
    : scanned?.requiereAlojamiento
      ? 'Alojamiento por asignar'
      : 'Sin alojamiento';

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
        <Tag color="processing">
          {stats.data?.presentes ?? 0} / {stats.data?.capacidadMaxima ?? 80}
        </Tag>
      </div>

      <div className="scanner-controls">
        <Segmented
          value={mode}
          onChange={(value) => setMode(value as ScanAction)}
          options={[
            { label: 'Check-in', value: 'checkin', icon: <LoginOutlined /> },
            { label: 'Check-out', value: 'checkout', icon: <LogoutOutlined /> },
          ]}
        />
      </div>

      <QrCamera
        active={cameraOn}
        startLabel={scanned || scanStatus !== 'idle' ? 'Escanear otro' : 'Activar escáner'}
        onDecode={onDecode}
        onStart={startCamera}
      />

      <div className="scan-result">
        <div className="scan-result-head">
          {scanStatus === 'ok' ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {statusText}
            </Tag>
          ) : scanStatus === 'error' ? (
            <Tag icon={<CloseCircleOutlined />} color="error">
              {statusText}
            </Tag>
          ) : (
            <Tag>{statusText}</Tag>
          )}
          {scanned && <Text type="secondary">{STATE_LABELS[scanned.estado]}</Text>}
        </div>
        {scanned ? (
          <Space align="start" size={12}>
            <Avatar shape="square" size={56} style={{ background: '#1E3A8A' }}>
              {participantInitials(scanned)}
            </Avatar>
            <span>
              <Title level={5} style={{ margin: 0 }}>
                {participantFullName(scanned)}
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {scanned.organizacionComunidad} • {scanned.ciudad}
              </Paragraph>
              <Space size={6} wrap style={{ marginTop: 6 }}>
                <Tag color="blue">{TYPE_LABELS[scanned.tipo]}</Tag>
                <Tag>{lodging}</Tag>
              </Space>
            </span>
          </Space>
        ) : (
          <Paragraph type="secondary" style={{ margin: 0 }}>
            El nombre, la comunidad, el tipo y la habitación aparecen aquí al leer un QR válido.
          </Paragraph>
        )}
      </div>

      <Button
        block
        icon={<IdcardOutlined />}
        loading={byDocument.isPending}
        onClick={() => setManualOpen(true)}
      >
        Búsqueda Manual por Cédula / DNI
      </Button>

      <Modal
        title="Búsqueda por cédula"
        open={manualOpen}
        onCancel={() => setManualOpen(false)}
        onOk={() => void searchManual()}
        confirmLoading={byDocument.isPending || validate.isPending}
        okText="Buscar y validar"
      >
        <Input
          placeholder="V19482109"
          value={cedula}
          onChange={(event) => setCedula(event.target.value)}
          onPressEnter={() => void searchManual()}
        />
      </Modal>
    </div>
  );
};

export default Escaner;
