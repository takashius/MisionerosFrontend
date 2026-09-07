import {
  IdcardOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { badgePath } from '@utils/badgeSession';
import { venueMapsUrl } from '@data/venue';

const items = [
  { key: '/pase', icon: <IdcardOutlined />, label: 'Credencial' },
  { key: '/programa', icon: <CalendarOutlined />, label: 'Programa' },
  {
    key: '/mapa',
    icon: <EnvironmentOutlined />,
    label: 'Mapa',
    href: venueMapsUrl(),
  },
  { key: '/perfil', icon: <UserOutlined />, label: 'Perfil' },
];

const tabKey = (pathname: string) => {
  if (pathname.startsWith('/pase')) return '/pase';
  return pathname;
};

const MobileTabBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = tabKey(pathname);

  return (
    <nav className="mobile-tabbar" aria-label="Navegación de credencial">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.key}
            className="mobile-tabbar-item"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir la sede CEV en Google Maps"
          >
            <span className="mobile-tabbar-icon">{item.icon}</span>
            <span className="mobile-tabbar-label">{item.label}</span>
          </a>
        ) : (
          <button
            key={item.key}
            type="button"
            className={`mobile-tabbar-item${current === item.key ? ' is-active' : ''}`}
            onClick={() => navigate(item.key === '/pase' ? badgePath() : item.key)}
          >
            <span className="mobile-tabbar-icon">{item.icon}</span>
            <span className="mobile-tabbar-label">{item.label}</span>
          </button>
        )
      )}
    </nav>
  );
};

export default MobileTabBar;
