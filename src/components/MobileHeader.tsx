import { Avatar, Button, Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import { useLogout } from '@api/auth';
import logo from '../assets/logo.svg';

const MobileHeader = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const logoutMutation = useLogout();
  const initials = ((user?.name?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || 'U';

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        navigate('/');
      },
    });
  };

  return (
    <header className="mobile-header">
      <Link to="/" className="mobile-header-brand">
        <img src={logo} alt="Misioneros Digitales" width={32} height={32} />
        <span className="mobile-header-copy">
          <strong>Misioneros Digitales</strong>
          <span>Caracas 2026</span>
        </span>
      </Link>
      {token ? (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: 'perfil',
                icon: <UserOutlined />,
                label: 'Perfil',
                onClick: () => navigate('/perfil'),
              },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Cerrar sesión',
                onClick: onLogout,
              },
            ],
          }}
        >
          <Button type="text" className="mobile-header-avatar" aria-label="Cuenta">
            <Avatar size={36} style={{ background: '#1E3A8A' }}>
              {initials}
            </Avatar>
          </Button>
        </Dropdown>
      ) : (
        <Button type="text" className="mobile-header-avatar" onClick={() => navigate('/perfil')}>
          <Avatar size={36} style={{ background: '#1E3A8A' }} icon={<UserOutlined />} />
        </Button>
      )}
    </header>
  );
};

export default MobileHeader;
