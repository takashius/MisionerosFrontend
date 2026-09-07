import { Avatar, Button, Dropdown, Space } from 'antd';
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
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logo} alt="Misioneros Digitales" width={32} height={32} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <strong style={{ color: '#00236F', fontSize: 14 }}>
            I Asamblea Misioneros Digitales
          </strong>
          <span
            style={{
              color: '#2563EB',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Caracas 2026
          </span>
        </span>
      </Link>
      <Space>
        {token ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Cerrar sesión',
                  onClick: onLogout,
                },
              ],
            }}
          >
            <Button type="text" style={{ padding: 0, height: 'auto' }}>
              <Avatar style={{ background: '#1E3A8A' }}>{initials}</Avatar>
            </Button>
          </Dropdown>
        ) : (
          <Avatar style={{ background: '#1E3A8A' }} icon={<UserOutlined />} />
        )}
      </Space>
    </header>
  );
};

export default MobileHeader;
