import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '@components/AppHeader';

const PortalLayout = () => (
  <Layout style={{ minHeight: '100vh', background: '#F8F9FF' }}>
    <AppHeader />
    <Layout.Content>
      <Outlet />
    </Layout.Content>
  </Layout>
);

export default PortalLayout;
