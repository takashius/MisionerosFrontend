import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import MobileHeader from '@components/MobileHeader';
import MobileTabBar from '@components/MobileTabBar';

const MobileLayout = () => {
  const { pathname } = useLocation();
  const hideTabs = pathname.startsWith('/escaner');

  return (
    <Layout className={`mobile-shell${hideTabs ? '' : ' has-tabbar'}`}>
      <MobileHeader />
      <Layout.Content className="mobile-content">
        <Outlet />
      </Layout.Content>
      {!hideTabs && <MobileTabBar />}
    </Layout>
  );
};

export default MobileLayout;
