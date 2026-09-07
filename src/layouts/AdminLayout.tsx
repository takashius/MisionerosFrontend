import { Layout, Menu, Avatar, Button, Dropdown, Space, Typography } from 'antd';
import {
  CalendarOutlined,
  IdcardOutlined,
  TeamOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import { useLogout } from '@api/auth';
import logo from '../assets/logo.svg';

const { Sider, Header, Content } = Layout;

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const logoutMutation = useLogout();

  const items = [
    { key: '/admin', icon: <IdcardOutlined />, label: <Link to="/admin">Acreditación</Link> },
    {
      key: '/admin/participantes',
      icon: <TeamOutlined />,
      label: <Link to="/admin/participantes">Participantes</Link>,
    },
    {
      key: '/admin/cronograma',
      icon: <CalendarOutlined />,
      label: <Link to="/admin/cronograma">Cronograma</Link>,
    },
    ...(isAdmin
      ? [
          {
            key: '/admin/usuarios',
            icon: <UserOutlined />,
            label: <Link to="/admin/usuarios">Usuarios</Link>,
          },
        ]
      : []),
  ];

  const displayName = [user?.name, user?.lastName].filter(Boolean).join(' ') || 'Administración CEV';
  const initials = (user?.name?.[0] || 'A') + (user?.lastName?.[0] || '');

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        navigate('/');
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="admin-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Misioneros Digitales" width={32} height={32} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <strong style={{ color: '#00236F', fontSize: 16 }}>
              I Asamblea de Misioneros Digitales
            </strong>
            <span style={{ color: '#757682', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              Caracas 2026 • Sede Central
            </span>
          </span>
        </Link>
        <Space size="middle">
          <BellOutlined style={{ fontSize: 18, color: '#444651' }} />
          <span style={{ textAlign: 'right', lineHeight: 1.2 }}>
            <Typography.Text strong style={{ display: 'block' }}>
              {displayName}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Typography.Text>
          </span>
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
              <Avatar style={{ background: '#1E3A8A' }}>{initials.toUpperCase()}</Avatar>
            </Button>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider width={256} theme="light" className="admin-sider">
          <Typography.Text
            type="secondary"
            style={{
              display: 'block',
              padding: '16px 24px 8px',
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Gestión Pastoral
          </Typography.Text>
          <Menu mode="inline" selectedKeys={[pathname]} items={items} />
          <div className="admin-sider-footer">
            <Typography.Text strong style={{ display: 'block', fontSize: 13 }}>
              Conexión Segura
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Servidores CEV Cloud
            </Typography.Text>
          </div>
        </Sider>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
