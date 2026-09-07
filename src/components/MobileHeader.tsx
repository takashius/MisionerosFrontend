import { Avatar, Space } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const MobileHeader = () => (
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
      <Avatar style={{ background: '#1E3A8A' }}>EH</Avatar>
    </Space>
  </header>
);

export default MobileHeader;
