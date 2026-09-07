import { App, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoveryOne } from '@api/auth';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import AuthCard from '@components/AuthCard';
import { RECOVERY_EMAIL_KEY } from '@utils/recovery';

const RecoverPassword = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const recovery = useRecoveryOne();

  const onFinish = ({ email }: { email: string }) => {
    recovery.mutate(email, {
      onSuccess: (backendMessage) => {
        sessionStorage.setItem(RECOVERY_EMAIL_KEY, email);
        message.success(
          typeof backendMessage === 'string' && backendMessage.trim()
            ? backendMessage
            : 'Si el correo está registrado, recibirás un código de recuperación.'
        );
        navigate('/recuperar/codigo');
      },
      onError: (error) => {
        if (wasErrorToastShown(error)) return;
        message.error(getApiErrorMessage(error, 'No se pudo enviar el código'));
      },
    });
  };

  return (
    <AuthCard
      title="Olvidé mi contraseña"
      description="Te enviaremos un código de 6 dígitos al correo institucional, si está registrado."
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Correo institucional"
          rules={[{ required: true, type: 'email', message: 'Ingresa un correo válido' }]}
        >
          <Input size="large" placeholder="vicaria@cev.org.ve" autoComplete="email" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={recovery.isPending}>
          Enviar código
        </Button>
      </Form>
      <div style={{ marginTop: 16 }}>
        <Link to="/login">Volver al login</Link>
      </div>
    </AuthCard>
  );
};

export default RecoverPassword;
