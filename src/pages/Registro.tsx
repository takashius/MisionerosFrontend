import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd';
import { Link } from 'react-router-dom';
import { useRegisterParticipant } from '@api/participants';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import { PARTICIPANT_TYPES, TYPE_LABELS, type RegisterParticipantPayload } from '@app-types/participants';

const { Title, Paragraph } = Typography;

type FormValues = RegisterParticipantPayload;

const Registro = () => {
  const [form] = Form.useForm<FormValues>();
  const register = useRegisterParticipant();
  const [done, setDone] = useState(false);

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
        Tras inscribirte, espera la confirmación de pago para recibir tu credencial.
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
          initialValues={{ tipo: 'misionero', sexo: 'M', requiereAlojamiento: true }}
          onFinish={(values) => {
            register.mutate(
              {
                ...values,
                fechaNacimiento: new Date(`${values.fechaNacimiento}T00:00:00`).toISOString(),
              },
              {
                onSuccess: () => setDone(true),
              }
            );
          }}
        >
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
                label="Cédula o pasaporte"
                rules={[{ required: true, message: 'Obligatorio' }]}
              >
                <Input size="large" placeholder="V19482109" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                rules={[{ required: true, message: 'Obligatorio' }]}
              >
                <Input size="large" type="date" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="sexo" label="Sexo" rules={[{ required: true }]}>
                <Radio.Group
                  optionType="button"
                  options={[
                    { label: 'Masculino', value: 'M' },
                    { label: 'Femenino', value: 'F' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="tipo" label="Tipo de asistente" rules={[{ required: true }]}>
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
                name="email"
                label="Correo"
                rules={[{ required: true, type: 'email', message: 'Correo válido' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="whatsapp" label="WhatsApp" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input size="large" placeholder="+58 412..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="ciudad" label="Ciudad" rules={[{ required: true, message: 'Obligatorio' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="organizacionComunidad"
                label="Organización o comunidad"
                rules={[{ required: true, message: 'Obligatorio' }]}
              >
                <Input size="large" placeholder="Diócesis, parroquia o movimiento" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="requiereAlojamiento"
                label="¿Requiere alojamiento en sede?"
                valuePropName="checked"
              >
                <Switch checkedChildren="Sí" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" size="large" block loading={register.isPending}>
            Enviar inscripción
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Registro;
