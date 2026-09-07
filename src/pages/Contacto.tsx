import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, Result, Row, Typography } from 'antd';
import { useSendContact, type ContactPayload } from '@api/contact';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import VenueMap from '@components/VenueMap';

const { Title, Paragraph } = Typography;

const Contacto = () => {
  const [form] = Form.useForm<ContactPayload>();
  const send = useSendContact();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="info-page">
        <Result
          status="success"
          title="Mensaje enviado"
          subTitle="El equipo de la CEV recibirá tu consulta. Te responderemos al correo que indicaste."
          extra={
            <Button type="primary" onClick={() => setDone(false)}>
              Escribir otro mensaje
            </Button>
          }
        />
        <Card bordered={false} className="access-card">
          <VenueMap />
        </Card>
      </div>
    );
  }

  return (
    <div className="info-page">
      <Title level={2} style={{ color: '#00236F', marginBottom: 8 }}>
        Contacto
      </Title>
      <Paragraph type="secondary">
        Escribe al equipo de la I Asamblea de Misioneros Digitales o ubica la sede
        en Montalbán.
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card bordered={false} className="access-card">
            {send.isError && !wasErrorToastShown(send.error) && (
              <Alert
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                message={getApiErrorMessage(send.error, 'No se pudo enviar el mensaje')}
              />
            )}
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => {
                send.mutate(values, {
                  onSuccess: () => {
                    form.resetFields();
                    setDone(true);
                  },
                });
              }}
            >
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true, message: 'Indica tu nombre' }]}
              >
                <Input placeholder="Nombre y apellido" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Correo"
                rules={[
                  { required: true, message: 'Indica tu correo' },
                  { type: 'email', message: 'El correo no es válido' },
                ]}
              >
                <Input type="email" placeholder="tucorreo@ejemplo.com" />
              </Form.Item>
              <Form.Item name="telefono" label="Teléfono o WhatsApp">
                <Input placeholder="+58 412 0000000" />
              </Form.Item>
              <Form.Item
                name="asunto"
                label="Asunto"
                rules={[{ required: true, message: 'Indica el asunto' }]}
              >
                <Input placeholder="Acreditación, hospedaje, traslado…" />
              </Form.Item>
              <Form.Item
                name="mensaje"
                label="Mensaje"
                rules={[
                  { required: true, message: 'Escribe tu mensaje' },
                  { min: 10, message: 'El mensaje debe tener al menos 10 caracteres' },
                ]}
              >
                <Input.TextArea rows={5} placeholder="¿En qué podemos ayudarte?" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={send.isPending} block>
                Enviar mensaje
              </Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card bordered={false} className="access-card">
            <VenueMap />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contacto;
