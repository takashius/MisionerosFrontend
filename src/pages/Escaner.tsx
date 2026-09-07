import { useEffect, useRef, useState } from 'react';
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
import { Html5Qrcode } from 'html5-qrcode';
import { useParticipantByDocument, useParticipantStats } from '@api/participants';
import { useValidateScan, type ScanAction } from '@api/scans';
import { extractPublicToken } from '@utils/extractPublicToken';
import { playScanTone } from '@utils/scanFeedback';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
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
  const [cameraReady, setCameraReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const modeRef = useRef<ScanAction>('checkin');
  const stats = useParticipantStats();
  const validate = useValidateScan();
  const byDocument = useParticipantByDocument();
  const validateRef = useRef(validate.mutateAsync);
  const runValidateRef = useRef<(token: string) => Promise<void>>(async () => undefined);

  modeRef.current = mode;
  validateRef.current = validate.mutateAsync;

  const runValidate = async (publicToken: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      scannerRef.current?.pause(true);
    } catch {
      // pause es opcional
    }

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
        try {
          scannerRef.current?.resume();
        } catch {
          // resume es opcional
        }
      }, 1600);
    }
  };

  runValidateRef.current = runValidate;

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    const start = async () => {
      const config = { fps: 8, qrbox: { width: 220, height: 220 } };
      const onScan = (decoded: string) => {
        const token = extractPublicToken(decoded);
        if (!token) {
          playScanTone(false);
          setScanStatus('error');
          setStatusText('El QR no contiene un token válido');
          return;
        }
        void runValidateRef.current(token);
      };

      try {
        await scanner.start({ facingMode: 'environment' }, config, onScan, () => undefined);
        setCameraReady(true);
      } catch {
        try {
          await scanner.start({ facingMode: 'user' }, config, onScan, () => undefined);
          setCameraReady(true);
        } catch {
          setCameraReady(false);
        }
      }
    };

    void start();

    return () => {
      scanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          try {
            scanner.clear();
          } catch {
            // ignore
          }
        });
      scannerRef.current = null;
    };
  }, []);

  const searchManual = async () => {
    if (!cedula.trim()) return;
    try {
      const participant = await byDocument.mutateAsync(cedula.trim());
      setManualOpen(false);
      setCedula('');
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

      <div className="viewfinder">
        <div id="qr-reader" />
        {!cameraReady && (
          <span className="viewfinder-hint">Cámara no disponible. Usa la búsqueda por cédula.</span>
        )}
        {cameraReady && <span className="viewfinder-hint">Alinee el código QR del carnet</span>}
      </div>

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
