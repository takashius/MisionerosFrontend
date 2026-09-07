import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

type InfoPageProps = {
  title: string;
  description: string;
};

const InfoPage = ({ title, description }: InfoPageProps) => (
  <div className="info-page">
    <Card bordered={false}>
      <Title level={2} style={{ color: '#00236F' }}>
        {title}
      </Title>
      <Paragraph type="secondary">{description}</Paragraph>
      <Paragraph>
        Esta sección se completará con el contenido oficial de la I Asamblea de
        Misioneros Digitales. Por ahora el acceso está disponible desde el portal
        principal.
      </Paragraph>
    </Card>
  </div>
);

export default InfoPage;
