import { useState } from 'react';
import { Alert, App, Button, Card, Form, Result, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useRegisterParticipant, useUploadReceipt } from '@api/participants';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import { buildParticipantWritePayload } from '@utils/participantForm';
import ParticipantFormFields from '@components/ParticipantFormFields';
import type { ParticipantFormValues, RegisterParticipantPayload } from '@app-types/participants';

const { Title, Paragraph } = Typography;

const Registro = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<ParticipantFormValues>();
  const register = useRegisterParticipant();
  const uploadReceipt = useUploadReceipt();
  const [done, setDone] = useState(false);
  const [comprobante, setComprobante] = useState<File | null>(null);

  if (done) {
    return (
      <div className="registro-page">
        <Result
          status="success"
          title="Inscripción recibida"
          subTitle="Quedaste en estado registrado. El pase digital se habilita cuando coordinación confirme el pago y te envíe el QR por correo."
          extra={
            <Link to="/">
              <Button type="primary">Volver al portal</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="registro-page">
      <Title level={2} style={{ color: '#00236F', marginBottom: 8 }}>
        Registro de participantes
      </Title>
      <Paragraph type="secondary">
        I Asamblea de Misioneros Digitales · Caracas 2026. Aforo máximo de 80 plazas.
        Solo son obligatorios nombre, apellido, cédula y correo; el resto puedes completarlo si lo
        tienes a mano.
      </Paragraph>

      <Card bordered={false} className="access-card">
        {register.isError && !wasErrorToastShown(register.error) && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message={getApiErrorMessage(register.error, 'No se pudo completar el registro')}
          />
        )}
        <Form
          layout="vertical"
          form={form}
          initialValues={{ tipo: 'misionero', requiereAlojamiento: true }}
          onFinish={async (values) => {
            let comprobanteUrl: string | undefined;
            if (comprobante) {
              try {
                const uploaded = await uploadReceipt.mutateAsync(comprobante);
                comprobanteUrl = uploaded.url;
              } catch (error) {
                if (!wasErrorToastShown(error)) {
                  message.error(getApiErrorMessage(error, 'No se pudo subir el comprobante'));
                }
                return;
              }
            }

            const payload = buildParticipantWritePayload(values, { comprobanteUrl }) as RegisterParticipantPayload;
            register.mutate(payload, {
              onSuccess: () => setDone(true),
            });
          }}
        >
          <ParticipantFormFields onComprobanteChange={setComprobante} />
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={register.isPending || uploadReceipt.isPending}
          >
            Enviar inscripción
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Registro;
