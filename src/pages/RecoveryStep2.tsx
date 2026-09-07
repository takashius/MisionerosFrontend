import { useState } from 'react';
import { App, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoveryTwo } from '@api/auth';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import AuthCard from '@components/AuthCard';
import { RECOVERY_EMAIL_KEY } from '@utils/recovery';

const RecoveryStep2 = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const recovery = useRecoveryTwo();
  const [code, setCode] = useState('');
  const email = sessionStorage.getItem(RECOVERY_EMAIL_KEY) || '';

  const onFinish = ({ password }: { password: string }) => {
    if (!email) {
      message.warning('Vuelve a solicitar el código con tu correo.');
      navigate('/recuperar');
      return;
    }
    recovery.mutate(
      { email, code, newPass: password },
      {
        onSuccess: () => {
          sessionStorage.removeItem(RECOVERY_EMAIL_KEY);
          message.success('Contraseña actualizada. Ya puedes entrar.');
          navigate('/login');
        },
        onError: (error) => {
          if (wasErrorToastShown(error)) return;
          message.error(getApiErrorMessage(error, 'Código incorrecto o expirado'));
        },
      }
    );
  };

  return (
    <AuthCard
      title="Restablecer contraseña"
      description="Ingresa el código de 6 dígitos que llegó a tu correo y define una clave nueva (mínimo 8 caracteres)."
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Código" required>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Input.OTP length={6} value={code} onChange={setCode} size="large" />
          </div>
        </Form.Item>
        <Form.Item
          name="password"
          label="Nueva contraseña"
          rules={[
            { required: true, message: 'Ingresa la nueva contraseña' },
            { min: 8, message: 'Mínimo 8 caracteres' },
          ]}
        >
          <Input.Password size="large" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirmar contraseña"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirma la contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'));
              },
            }),
          ]}
        >
          <Input.Password size="large" autoComplete="new-password" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={recovery.isPending}
          disabled={code.length < 6}
        >
          Guardar contraseña
        </Button>
      </Form>
      <div style={{ marginTop: 16 }}>
        <Link to="/recuperar">Pedir otro código</Link>
        {' · '}
        <Link to="/login">Volver al login</Link>
      </div>
    </AuthCard>
  );
};

export default RecoveryStep2;
