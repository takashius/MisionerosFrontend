import { Avatar, Button, Card, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import { useLogout } from '@api/auth';
import { ROLE_LABELS, type UserRoleName } from '@app-types/users';
import { clearBadgeToken } from '@utils/badgeSession';

const { Title, Paragraph, Text } = Typography;

const roleLabel = (roles?: string[]) => {
  const role = roles?.[0] as UserRoleName | undefined;
  if (!role) return 'Asistente';
  return ROLE_LABELS[role] || role;
};

const Perfil = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const logoutMutation = useLogout();
  const displayName = [user?.name, user?.lastName].filter(Boolean).join(' ') || 'Invitado';
  const initials = ((user?.name?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'IN';

  const leave = () => {
    clearBadgeToken();
    if (!token) {
      navigate('/');
      return;
    }
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        navigate('/');
      },
    });
  };

  return (
    <div className="perfil-page">
      <Card bordered={false} className="access-card">
        <div className="perfil-identity">
          <Avatar size={72} style={{ background: '#1E3A8A', fontSize: 24 }}>
            {initials}
          </Avatar>
          <Title level={4} style={{ margin: '12px 0 4px', color: '#00236F' }}>
            {token ? displayName : 'Tu credencial'}
          </Title>
          <Text type="secondary">{token ? user?.email : 'Sesión de consulta del pase'}</Text>
          {token && (
            <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
              {roleLabel(user?.role)}
            </Paragraph>
          )}
        </div>
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          {token
            ? 'Cierra la sesión para salir de la terminal y volver al portal.'
            : 'Vuelve al portal cuando termines de consultar tu pase digital.'}
        </Paragraph>
        <Button
          type="primary"
          danger={Boolean(token)}
          block
          size="large"
          icon={<LogoutOutlined />}
          loading={logoutMutation.isPending}
          onClick={leave}
        >
          {token ? 'Cerrar sesión' : 'Salir al inicio'}
        </Button>
      </Card>
    </div>
  );
};

export default Perfil;
