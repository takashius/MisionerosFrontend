import { Card, Typography } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import AdminLoginForm from '@components/AdminLoginForm';
import logo from '../assets/logo.svg';

const { Title, Paragraph } = Typography;

const Login = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <img src={logo} alt="Misioneros Digitales" width={48} height={48} />
        <Title level={3} style={{ color: '#00236F', marginTop: 16 }}>
          Gestión CEV
        </Title>
        <Paragraph type="secondary">
          Acceso restringido al panel de acreditación de la I Asamblea de
          Misioneros Digitales. Solo cuentas ADMIN o SUPER_ADMIN.
        </Paragraph>
        <AdminLoginForm />
        <div style={{ marginTop: 8 }}>
          <Link to="/">Volver al portal</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
