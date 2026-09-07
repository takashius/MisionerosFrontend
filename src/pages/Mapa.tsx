import { useEffect } from 'react';
import { Button, Card, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { VENUE, venueMapsUrl } from '@data/venue';

const { Title, Paragraph } = Typography;

const Mapa = () => {
  const mapsUrl = venueMapsUrl();

  useEffect(() => {
    window.location.assign(mapsUrl);
  }, [mapsUrl]);

  return (
    <div className="info-page">
      <Card bordered={false}>
        <Title level={3} style={{ color: '#00236F' }}>
          {VENUE.name}
        </Title>
        <Paragraph type="secondary">{VENUE.address}</Paragraph>
        <Button type="primary" icon={<EnvironmentOutlined />} href={mapsUrl} target="_blank" rel="noreferrer">
          Abrir en Google Maps
        </Button>
      </Card>
    </div>
  );
};

export default Mapa;
