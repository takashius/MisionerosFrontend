import type { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const { Title, Paragraph } = Typography;

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const AuthCard = ({ title, description, children }: AuthCardProps) => (
  <div className="login-page">
    <Card className="login-card" bordered={false}>
      <Link to="/">
        <img src={logo} alt="Misioneros Digitales" width={48} height={48} />
      </Link>
      <Title level={3} style={{ color: '#00236F', marginTop: 16 }}>
        {title}
      </Title>
      {description && <Paragraph type="secondary">{description}</Paragraph>}
      {children}
    </Card>
  </div>
);

export default AuthCard;
