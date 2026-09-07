import { Layout, Menu, Avatar, Space, Typography } from 'antd';
import {
  IdcardOutlined,
  HomeOutlined,
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  BellOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const { Sider, Header, Content } = Layout;

const items = [
  { key: '/admin', icon: <IdcardOutlined />, label: <Link to="/admin">Acreditación</Link> },
  { key: '/admin/alojamientos', icon: <HomeOutlined />, label: <Link to="/admin/alojamientos">Alojamientos</Link> },
  { key: '/admin/finanzas', icon: <WalletOutlined />, label: <Link to="/admin/finanzas">Finanzas</Link> },
  { key: '/admin/reportes', icon: <BarChartOutlined />, label: <Link to="/admin/reportes">Reportes</Link> },
  { type: 'divider' as const },
  { key: '/admin/ajustes', icon: <SettingOutlined />, label: <Link to="/admin/ajustes">Ajustes Generales</Link> },
  { key: '/admin/delegaciones', icon: <TeamOutlined />, label: <Link to="/admin/delegaciones">Delegaciones</Link> },
];

const AdminLayout = () => {
  const { pathname } = useLocation();

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
          <QuestionCircleOutlined style={{ fontSize: 18, color: '#444651' }} />
          <span style={{ textAlign: 'right', lineHeight: 1.2 }}>
            <Typography.Text strong style={{ display: 'block' }}>
              Administración CEV
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Superintendente
            </Typography.Text>
          </span>
          <Avatar style={{ background: '#1E3A8A' }}>CEV</Avatar>
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
