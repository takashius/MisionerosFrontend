import { useMemo, useState } from 'react';
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useCreateScheduleItem,
  useDeleteScheduleItem,
  useManageSchedule,
  useUpdateScheduleItem,
} from '@api/schedule';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import {
  DAY_LABELS,
  TYPE_COLORS,
  TYPE_LABELS,
  formatDayLabel,
  type ScheduleItem,
  type SchedulePayload,
} from '@app-types/schedule';
import CronogramaFormModal from './CronogramaFormModal';

const { Title, Paragraph, Text } = Typography;

const timeRange = (item: ScheduleItem) =>
  item.horaFin ? `${item.horaInicio} – ${item.horaFin}` : item.horaInicio;

const CronogramaAdmin = () => {
  const { message } = App.useApp();
  const [fecha, setFecha] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const list = useManageSchedule(fecha || undefined);
  const createItem = useCreateScheduleItem();
  const updateItem = useUpdateScheduleItem();
  const deleteItem = useDeleteScheduleItem();

  const showError = (error: unknown, fallback: string) => {
    if (wasErrorToastShown(error)) return;
    message.error(getApiErrorMessage(error, fallback));
  };

  const dayOptions = useMemo(() => {
    const fromData = new Set((list.data ?? []).map((item) => item.fecha));
    Object.keys(DAY_LABELS).forEach((day) => fromData.add(day));
    return Array.from(fromData)
      .sort()
      .map((value) => ({ value, label: formatDayLabel(value) }));
  }, [list.data]);

  const columns: ColumnsType<ScheduleItem> = [
    {
      title: 'Hora',
      width: 140,
      render: (_, row) => <Text strong>{timeRange(row)}</Text>,
    },
    {
      title: 'Bloque',
      render: (_, row) => (
        <span>
          <Text strong>{row.titulo}</Text>
          {(row.ponente || row.moderador) && (
            <>
              <br />
              <Text type="secondary">
                {[row.ponente && `Ponente: ${row.ponente}`, row.moderador && `Modera: ${row.moderador}`]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </>
          )}
        </span>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 160,
      render: (tipo: ScheduleItem['tipo']) => (
        <Tag color={TYPE_COLORS[tipo]}>{TYPE_LABELS[tipo]}</Tag>
      ),
    },
    {
      title: 'Estado',
      width: 120,
      render: (_, row) =>
        row.publicado === false ? <Tag>Borrador</Tag> : <Tag color="green">Publicado</Tag>,
    },
    {
      title: 'Acciones',
      align: 'right',
      width: 180,
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(row);
              setFormOpen(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar este bloque?"
            description="Dejará de aparecer en el cronograma público y en el panel."
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() =>
              deleteItem.mutate(row._id, {
                onSuccess: () => message.success('Bloque eliminado'),
                onError: (error) => showError(error, 'No se pudo eliminar'),
              })
            }
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const save = (values: SchedulePayload) => {
    if (editing) {
      updateItem.mutate(
        { id: editing._id, ...values },
        {
          onSuccess: () => {
            message.success('Bloque actualizado');
            setFormOpen(false);
            setEditing(null);
          },
          onError: (error) => showError(error, 'No se pudo actualizar'),
        }
      );
      return;
    }
    createItem.mutate(values, {
      onSuccess: () => {
        message.success('Bloque creado');
        setFormOpen(false);
      },
      onError: (error) => showError(error, 'No se pudo crear el bloque'),
    });
  };

  return (
    <div>
      <Breadcrumb
        items={[{ title: 'Inicio' }, { title: 'Gestión CEV' }, { title: 'Cronograma' }]}
        style={{ marginBottom: 8 }}
      />
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={2} style={{ margin: 0, color: '#00236F' }}>
            Cronograma
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Agenda oficial de la asamblea. Lo publicado se ve en /cronograma y /programa.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Nuevo bloque
        </Button>
      </Space>

      <Card>
        <Select
          allowClear
          placeholder="Filtrar por día"
          style={{ minWidth: 280, marginBottom: 16 }}
          value={fecha || undefined}
          options={dayOptions}
          onChange={(value) => setFecha(value || '')}
        />
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={list.data ?? []}
          loading={list.isFetching}
          scroll={{ x: 860 }}
          pagination={false}
          locale={{ emptyText: 'Aún no hay bloques en el cronograma' }}
        />
      </Card>

      <CronogramaFormModal
        open={formOpen}
        editing={editing}
        loading={createItem.isPending || updateItem.isPending}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={save}
      />
    </div>
  );
};

export default CronogramaAdmin;
