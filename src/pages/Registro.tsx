import { useState } from 'react';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Select,
  Switch,
  Typography,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useRegisterParticipant, useUploadReceipt } from '@api/participants';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import {
  ESTADOS_VIDA,
  PARTICIPANT_TYPES,
  TYPE_LABELS,
  type RegisterParticipantPayload,
  type Sexo,
} from '@app-types/participants';

const { Title, Paragraph } = Typography;

type FormValues = {
  nombres: string;
  apellidos: string;
  documentoId: string;
  email: string;
  edad?: number;
  fechaNacimiento?: string;
  sexo?: Sexo;
  whatsapp?: string;
  telefonoEmergencia?: string;
  arquidiocesis?: string;
  organizacionComunidad?: string;
  redesSociales?: string;
  ciudad?: string;
  estadoVida?: string;
  tieneAlergiaEnfermedad?: boolean;
  alergiasEnfermedadDetalle?: string;
  tipo?: RegisterParticipantPayload['tipo'];
  requiereAlojamiento?: boolean;
  pagoTitular?: string;
  pagoBanco?: string;
  pagoFecha?: string;
  pagoReferencia?: string;
  pagoMonto?: string;
  pagoTasaBcv?: string;
};

const optional = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const Registro = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const register = useRegisterParticipant();
  const uploadReceipt = useUploadReceipt();
  const [done, setDone] = useState(false);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const tieneAlergia = Form.useWatch('tieneAlergiaEnfermedad', form);

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

            const payload: RegisterParticipantPayload = {
              nombres: values.nombres.trim(),
              apellidos: values.apellidos.trim(),
              documentoId: values.documentoId.trim(),
              email: values.email.trim(),
              edad: values.edad,
              fechaNacimiento: values.fechaNacimiento
                ? new Date(`${values.fechaNacimiento}T00:00:00`).toISOString()
                : undefined,
              sexo: values.sexo,
              whatsapp: optional(values.whatsapp),
              telefonoEmergencia: optional(values.telefonoEmergencia),
              arquidiocesis: optional(values.arquidiocesis),
              organizacionComunidad: optional(values.organizacionComunidad),
              redesSociales: optional(values.redesSociales),
              ciudad: optional(values.ciudad),
              estadoVida: optional(values.estadoVida),
              tieneAlergiaEnfermedad: values.tieneAlergiaEnfermedad,
              alergiasEnfermedadDetalle: optional(values.alergiasEnfermedadDetalle),
              tipo: values.tipo,
              requiereAlojamiento: values.requiereAlojamiento !== false,
            };

            const pagoInscripcion = {
              titular: optional(values.pagoTitular),
              banco: optional(values.pagoBanco),
              fecha: values.pagoFecha
                ? new Date(`${values.pagoFecha}T00:00:00`).toISOString()
                : undefined,
              referencia: optional(values.pagoReferencia),
              monto: optional(values.pagoMonto),
              tasaBcv: optional(values.pagoTasaBcv),
              comprobanteUrl,
            };
            if (Object.values(pagoInscripcion).some(Boolean)) {
              payload.pagoInscripcion = pagoInscripcion;
            }

            register.mutate(payload, {
              onSuccess: () => setDone(true),
            });
          }}
        >
          <Divider orientation="left">Identificación</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="nombres" label="Nombres" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="documentoId"
                label="Número de cédula de identidad"
                rules={[{ required: true, message: 'Obligatorio' }]}
              >
                <Input size="large" placeholder="V19482109" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Dirección de correo electrónico"
                rules={[{ required: true, type: 'email', message: 'Correo válido' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="edad" label="Edad">
                <InputNumber size="large" min={1} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="fechaNacimiento" label="Fecha de nacimiento">
                <Input size="large" type="date" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="sexo" label="Sexo">
                <Radio.Group
                  optionType="button"
                  options={[
                    { label: 'Masculino', value: 'M' },
                    { label: 'Femenino', value: 'F' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Contacto e iglesia</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="whatsapp" label="Número de teléfono">
                <Input size="large" placeholder="+58 412..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="telefonoEmergencia" label="Número de teléfono en caso de emergencia">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="arquidiocesis" label="Arquidiócesis (Diócesis) a la que pertenece">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="organizacionComunidad"
                label="Parroquia y/o comunidad eclesial a la que pertenece"
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="redesSociales" label="Usuario de las redes sociales en las que evangeliza">
                <Input size="large" placeholder="@usuario o enlace" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="ciudad" label="Ciudad">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="estadoVida" label="Estado de vida">
                <Select
                  size="large"
                  allowClear
                  options={ESTADOS_VIDA.map((value) => ({ value, label: value }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Salud</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="tieneAlergiaEnfermedad"
                label="¿Sufre de alguna enfermedad o alergia a algún alimento y/o medicamento?"
              >
                <Radio.Group
                  optionType="button"
                  options={[
                    { label: 'Sí', value: true },
                    { label: 'No', value: false },
                  ]}
                />
              </Form.Item>
            </Col>
            {tieneAlergia === true && (
              <Col xs={24} md={12}>
                <Form.Item name="alergiasEnfermedadDetalle" label="Si su respuesta fue sí, indique cuál">
                  <Input size="large" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Divider orientation="left">Pago de inscripción</Divider>
          <Paragraph type="secondary" style={{ marginTop: -8 }}>
            Estos datos ayudan a coordinación a confirmar el pago. No habilitan el pase automáticamente.
          </Paragraph>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="pagoTitular" label="Nombre del titular de la cuenta desde la que realizó el pago">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="pagoBanco" label="Banco desde el que realizó el pago">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="pagoFecha" label="Fecha en la que se realizó el pago">
                <Input size="large" type="date" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="pagoReferencia" label="Número de referencia de la operación">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="pagoMonto" label="Monto exacto depositado">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="pagoTasaBcv" label="Tasa BCV del día en que realizó el pago">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Suba aquí el comprobante de pago de la inscripción">
                <Upload
                  maxCount={1}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  beforeUpload={(file) => {
                    setComprobante(file);
                    return false;
                  }}
                  onRemove={() => setComprobante(null)}
                >
                  <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Participación</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="tipo" label="Tipo de asistente">
                <Select
                  size="large"
                  options={PARTICIPANT_TYPES.map((tipo) => ({
                    value: tipo,
                    label: TYPE_LABELS[tipo],
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="requiereAlojamiento"
                label="¿Requiere alojamiento en sede?"
                valuePropName="checked"
              >
                <Switch checkedChildren="Sí" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
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
