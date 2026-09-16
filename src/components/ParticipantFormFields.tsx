import { Button, Col, Divider, Form, Input, InputNumber, Radio, Row, Select, Switch, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  ESTADOS_VIDA,
  PARTICIPANT_TYPES,
  TYPE_LABELS,
  type ParticipantFormValues,
} from '@app-types/participants';

const { Paragraph } = Typography;

type Props = {
  size?: 'large' | 'middle';
  showDocumento?: boolean;
  showTipo?: boolean;
  existingComprobanteUrl?: string;
  onComprobanteChange: (file: File | null) => void;
};

const ParticipantFormFields = ({
  size = 'large',
  showDocumento = true,
  showTipo = true,
  existingComprobanteUrl,
  onComprobanteChange,
}: Props) => {
  const form = Form.useFormInstance<ParticipantFormValues>();
  const tieneAlergia = Form.useWatch('tieneAlergiaEnfermedad', form);

  return (
    <>
      <Divider orientation="left">Identificación</Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="nombres" label="Nombres" rules={[{ required: true, message: 'Obligatorio' }]}>
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: 'Obligatorio' }]}>
            <Input size={size} />
          </Form.Item>
        </Col>
        {showDocumento && (
          <Col xs={24} md={12}>
            <Form.Item
              name="documentoId"
              label="Número de cédula de identidad"
              rules={[{ required: true, message: 'Obligatorio' }]}
            >
              <Input size={size} placeholder="V19482109" />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label="Dirección de correo electrónico"
            rules={[{ required: true, type: 'email', message: 'Correo válido' }]}
          >
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="edad" label="Edad">
            <InputNumber size={size} min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="fechaNacimiento" label="Fecha de nacimiento">
            <Input size={size} type="date" />
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
            <Input size={size} placeholder="+58 412..." />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="telefonoEmergencia" label="Número de teléfono en caso de emergencia">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="arquidiocesis" label="Arquidiócesis (Diócesis) a la que pertenece">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="organizacionComunidad" label="Parroquia y/o comunidad eclesial a la que pertenece">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="redesSociales" label="Usuario de las redes sociales en las que evangeliza">
            <Input size={size} placeholder="@usuario o enlace" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="ciudad" label="Ciudad">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="estadoVida" label="Estado de vida">
            <Select
              size={size}
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
              <Input size={size} />
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
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="pagoBanco" label="Banco desde el que realizó el pago">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="pagoFecha" label="Fecha en la que se realizó el pago">
            <Input size={size} type="date" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="pagoReferencia" label="Número de referencia de la operación">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="pagoMonto" label="Monto exacto depositado">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="pagoTasaBcv" label="Tasa BCV del día en que realizó el pago">
            <Input size={size} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Suba aquí el comprobante de pago de la inscripción">
            {existingComprobanteUrl && (
              <div style={{ marginBottom: 8 }}>
                <a href={existingComprobanteUrl} target="_blank" rel="noreferrer">
                  Ver comprobante actual
                </a>
              </div>
            )}
            <Upload
              maxCount={1}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              beforeUpload={(file) => {
                onComprobanteChange(file);
                return false;
              }}
              onRemove={() => onComprobanteChange(null)}
            >
              <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Participación</Divider>
      <Row gutter={16}>
        {showTipo && (
          <Col xs={24} md={12}>
            <Form.Item name="tipo" label="Tipo de asistente">
              <Select
                size={size}
                options={PARTICIPANT_TYPES.map((tipo) => ({
                  value: tipo,
                  label: TYPE_LABELS[tipo],
                }))}
              />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={12}>
          <Form.Item name="requiereAlojamiento" label="¿Requiere alojamiento en sede?" valuePropName="checked">
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ParticipantFormFields;
