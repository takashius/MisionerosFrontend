import { Layout, Menu } from 'antd';
import {
  IdcardOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { key: '/pase', icon: <IdcardOutlined />, label: 'Credencial' },
  { key: '/programa', icon: <CalendarOutlined />, label: 'Programa' },
  { key: '/mapa', icon: <EnvironmentOutlined />, label: 'Mapa CEV' },
  { key: '/perfil', icon: <UserOutlined />, label: 'Mi Perfil' },
];

const MobileTabBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Layout.Footer
      style={{
        position: 'sticky',
        bottom: 0,
        padding: 0,
        background: '#fff',
        borderTop: '1px solid #E2E8F0',
      }}
    >
      <Menu
        mode="horizontal"
        selectedKeys={[pathname.startsWith('/escaner') ? '/pase' : pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ justifyContent: 'space-around', border: 'none' }}
      />
    </Layout.Footer>
  );
};

export default MobileTabBar;
