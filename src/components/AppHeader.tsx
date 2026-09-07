import { Avatar, Button, Drawer, Grid, Menu, Space } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.svg';

const items = [
  { key: '/', label: 'Inicio', to: '/' },
  { key: '/registro', label: 'Registro', to: '/registro' },
  { key: '/cronograma', label: 'Cronograma', to: '/cronograma' },
  { key: '/ponentes', label: 'Ponentes', to: '/ponentes' },
  { key: '/vivo', label: 'Transmisión en Vivo', to: '/vivo' },
  { key: '/ayuda', label: 'Ayuda / Soporte', to: '/ayuda' },
  { key: '/contacto', label: 'Contacto CEV', to: '/contacto' },
];

const AppHeader = () => {
  const { pathname } = useLocation();
  const screens = Grid.useBreakpoint();
  const [open, setOpen] = useState(false);
  const compact = !screens.lg;

  return (
    <header className="portal-header">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <img src={logo} alt="Misioneros Digitales" width={32} height={32} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
          <strong className="portal-header-title">I Asamblea de Misioneros Digitales</strong>
          <span style={{ color: '#757682', fontSize: 11, letterSpacing: 0.4 }}>
            Caracas 2026 • Sede CEV
          </span>
        </span>
      </Link>
      {!compact && (
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={items.map((item) => ({
            key: item.key,
            label: <Link to={item.to}>{item.label}</Link>,
          }))}
          style={{ flex: 1, justifyContent: 'center', border: 'none', background: 'transparent', minWidth: 0 }}
        />
      )}
      <Space>
        {compact && (
          <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
        )}
        <Avatar style={{ background: '#1E3A8A' }} icon={<UserOutlined />} />
      </Space>
      <Drawer title="Navegación" open={open} onClose={() => setOpen(false)}>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          onClick={() => setOpen(false)}
          items={items.map((item) => ({
            key: item.key,
            label: <Link to={item.to}>{item.label}</Link>,
          }))}
        />
      </Drawer>
    </header>
  );
};

export default AppHeader;
