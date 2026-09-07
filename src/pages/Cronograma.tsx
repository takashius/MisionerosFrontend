import { Typography } from 'antd';
import { usePublicSchedule } from '@api/schedule';
import ScheduleTimeline from '@components/ScheduleTimeline';

const { Title, Paragraph } = Typography;

type CronogramaProps = {
  title?: string;
  description?: string;
};

const Cronograma = ({
  title = 'Cronograma',
  description = 'Agenda oficial de ponencias, liturgia y mesas de trabajo. 18 al 20 de septiembre de 2026.',
}: CronogramaProps) => {
  const schedule = usePublicSchedule();

  return (
    <div className="info-page">
      <Title level={2} style={{ color: '#00236F' }}>
        {title}
      </Title>
      <Paragraph type="secondary">{description}</Paragraph>
      <ScheduleTimeline items={schedule.data} loading={schedule.isLoading} />
    </div>
  );
};

export default Cronograma;
