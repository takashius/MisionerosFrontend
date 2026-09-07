import { Card, Empty, Spin, Tag, Timeline, Typography } from 'antd';
import {
  formatDayLabel,
  groupByFecha,
  TYPE_COLORS,
  TYPE_LABELS,
  type ScheduleItem,
} from '@app-types/schedule';

const { Title, Text, Paragraph } = Typography;

const timeRange = (item: ScheduleItem) =>
  item.horaFin ? `${item.horaInicio} – ${item.horaFin}` : item.horaInicio;

const ScheduleTimeline = ({
  items,
  loading,
}: {
  items?: ScheduleItem[];
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!items?.length) {
    return <Empty description="Aún no hay bloques publicados en el cronograma." />;
  }

  return (
    <div className="schedule-timeline">
      {groupByFecha(items).map(([fecha, dayItems]) => (
        <Card key={fecha} className="access-card" bordered={false} style={{ marginBottom: 16 }}>
          <Title level={4} style={{ color: '#00236F', marginTop: 0 }}>
            {formatDayLabel(fecha)}
          </Title>
          <Timeline
            items={dayItems.map((item) => ({
              color: '#1E3A8A',
              children: (
                <div>
                  <Text strong style={{ color: '#00236F' }}>
                    {timeRange(item)} · {item.titulo}
                  </Text>
                  <div style={{ margin: '6px 0' }}>
                    <Tag color={TYPE_COLORS[item.tipo]}>{TYPE_LABELS[item.tipo]}</Tag>
                  </div>
                  {item.ponente && (
                    <Text type="secondary" style={{ display: 'block' }}>
                      Ponente: {item.ponente}
                    </Text>
                  )}
                  {item.moderador && (
                    <Text type="secondary" style={{ display: 'block' }}>
                      Moderación: {item.moderador}
                    </Text>
                  )}
                  {item.descripcion && (
                    <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
                      {item.descripcion}
                    </Paragraph>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      ))}
    </div>
  );
};

export default ScheduleTimeline;
