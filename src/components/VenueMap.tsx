import { Button, Typography } from 'antd';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { VENUE, venueEmbedUrl, venueMapsUrl } from '@data/venue';
import { CONTACT_PHONE_LOCAL, CONTACT_PHONE_TEL } from '@data/contact';

const { Text } = Typography;

const VenueMap = ({ height = 360 }: { height?: number }) => (
  <div className="venue-map">
    <iframe
      title={`Mapa de ${VENUE.name}`}
      src={venueEmbedUrl()}
      width="100%"
      height={height}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
    <div className="venue-map-meta">
      <Text strong style={{ color: '#00236F', display: 'block' }}>
        {VENUE.name}
      </Text>
      <Text type="secondary">{VENUE.address}</Text>
      <Button
        type="link"
        icon={<PhoneOutlined />}
        href={`tel:${CONTACT_PHONE_TEL}`}
        style={{ paddingLeft: 0, display: 'block' }}
      >
        {CONTACT_PHONE_LOCAL}
      </Button>
      <Button
        type="link"
        icon={<EnvironmentOutlined />}
        href={venueMapsUrl()}
        target="_blank"
        rel="noreferrer"
        style={{ paddingLeft: 0 }}
      >
        Abrir en Google Maps
      </Button>
    </div>
  </div>
);

export default VenueMap;
