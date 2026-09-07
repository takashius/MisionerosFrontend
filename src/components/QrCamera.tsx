import { useEffect, useId, useRef, useState } from 'react';
import { Button } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

type QrCameraProps = {
  active: boolean;
  startLabel?: string;
  onDecode: (value: string) => void;
  onStart: () => void;
};

const pickCameraId = (cameras: { id: string; label: string }[]) => {
  const back = cameras.find((camera) => /back|rear|environment|trasera/i.test(camera.label));
  return (back ?? cameras[cameras.length - 1] ?? cameras[0])?.id;
};

const stopScanner = async (scanner: Html5Qrcode | null) => {
  if (!scanner) return;
  try {
    const state = scanner.getState();
    if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
      await scanner.stop();
    }
  } catch {
    // ignore
  }
  try {
    scanner.clear();
  } catch {
    // ignore
  }
};

const QrCamera = ({ active, startLabel = 'Activar escáner', onDecode, onStart }: QrCameraProps) => {
  const reactId = useId().replace(/:/g, '');
  const elementId = `qr-reader-${reactId}`;
  const onDecodeRef = useRef(onDecode);
  const handledRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  onDecodeRef.current = onDecode;

  useEffect(() => {
    if (!active) {
      setReady(false);
      setError(null);
      return;
    }

    let cancelled = false;
    let scanner: Html5Qrcode | null = null;
    handledRef.current = false;

    const start = async () => {
      setReady(false);
      setError(null);

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;
        const cameraId = pickCameraId(cameras);
        if (!cameraId) {
          setError('No se encontró una cámara en este dispositivo.');
          return;
        }

        const host = document.getElementById(elementId);
        if (!host || cancelled) return;

        scanner = new Html5Qrcode(elementId, { verbose: false });
        await scanner.start(
          cameraId,
          {
            fps: 8,
            aspectRatio: 1.333,
            disableFlip: false,
          },
          (decoded) => {
            if (handledRef.current || cancelled) return;
            handledRef.current = true;
            onDecodeRef.current(decoded);
          },
          () => undefined
        );

        if (cancelled) {
          await stopScanner(scanner);
          scanner = null;
          return;
        }
        setReady(true);
      } catch (cause) {
        if (cancelled) return;
        const text = cause instanceof Error ? cause.message : 'No se pudo iniciar la cámara';
        setError(text);
      }
    };

    void start();

    return () => {
      cancelled = true;
      void stopScanner(scanner);
    };
  }, [active, elementId, retryKey]);

  if (!active) {
    return (
      <div className="viewfinder viewfinder-idle">
        <ScanOutlined style={{ fontSize: 36, color: '#2563EB' }} />
        <Button type="primary" icon={<ScanOutlined />} onClick={onStart}>
          {startLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="viewfinder">
      <div id={elementId} className="qr-reader" />
      {ready && !error && <div className="reticle" />}
      {!ready && !error && <span className="viewfinder-hint">Activando cámara…</span>}
      {ready && !error && <span className="viewfinder-hint">Alinee el código QR del carnet</span>}
      {error && (
        <div className="viewfinder-error">
          <span>{error}</span>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setError(null);
              setRetryKey((value) => value + 1);
            }}
          >
            Reintentar cámara
          </Button>
        </div>
      )}
    </div>
  );
};

export default QrCamera;
