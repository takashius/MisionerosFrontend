import { Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const { Title, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <img src={logo} alt="Misioneros Digitales" width={48} height={48} />
        <Title level={3} style={{ color: '#00236F', marginTop: 16 }}>
          Gestión CEV
        </Title>
        <Paragraph type="secondary">
          Acceso restringido al panel de acreditación de la I Asamblea de
          Misioneros Digitales.
        </Paragraph>
        <Form layout="vertical" onFinish={() => navigate('/admin')}>
          <Form.Item
            name="email"
            label="Correo Institucional"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="vicaria@cev.org.ve" />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
            <Input.Password size="large" prefix={<LockOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Ingresar al Dashboard
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
