import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAdminLogin } from '@hooks/useAdminLogin';

type AdminLoginFormProps = {
  submitLabel?: string;
};

const AdminLoginForm = ({ submitLabel = 'Ingresar' }: AdminLoginFormProps) => {
  const { loginAdmin, isPending } = useAdminLogin();

  return (
    <Form layout="vertical" onFinish={loginAdmin}>
      <Form.Item
        name="email"
        label="Correo Institucional"
        rules={[{ required: true, type: 'email', message: 'Ingresa un correo válido' }]}
      >
        <Input
          size="large"
          prefix={<MailOutlined />}
          placeholder="vicaria@cev.org.ve"
          autoComplete="username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Contraseña Cifrada"
        rules={[{ required: true, message: 'Ingresa la contraseña' }]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="••••••••••••"
          autoComplete="current-password"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={isPending}>
        {submitLabel}
      </Button>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <Link to="/recuperar">Olvidé mi contraseña</Link>
      </div>
    </Form>
  );
};

export default AdminLoginForm;
