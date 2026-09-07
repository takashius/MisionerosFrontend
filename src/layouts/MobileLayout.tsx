import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MobileHeader from '@components/MobileHeader';
import MobileTabBar from '@components/MobileTabBar';

const MobileLayout = () => (
  <Layout className="mobile-shell">
    <MobileHeader />
    <Layout.Content className="mobile-content">
      <Outlet />
    </Layout.Content>
    <MobileTabBar />
  </Layout>
);

export default MobileLayout;
