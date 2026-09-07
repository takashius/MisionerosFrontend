import { useState } from 'react';
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  useChangeUserPassword,
  useCreateUser,
  useDeleteUser,
  useRoles,
  useUpdateUser,
  useUserList,
} from '@api/users';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getApiErrorMessage } from '@utils/getApiErrorMessage';
import { ROLE_LABELS, type UserListItem, type UserRoleName } from '@app-types/users';
import UserFormModal from './UserFormModal';
import ChangePasswordModal from './ChangePasswordModal';

const { Title, Paragraph } = Typography;

const roleColor: Record<UserRoleName, string> = {
  SUPER_ADMIN: 'purple',
  ADMIN: 'geekblue',
  MISIONERO: 'blue',
  PARTICIPANTE: 'default',
};

const Users = () => {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserListItem | null>(null);
  const [passwordUser, setPasswordUser] = useState<UserListItem | null>(null);

  const list = useUserList(page, search);
  const roles = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const changePassword = useChangeUserPassword();

  const showError = (error: unknown, fallback: string) => {
    if (wasErrorToastShown(error)) return;
    message.error(getApiErrorMessage(error, fallback));
  };

  const columns: ColumnsType<UserListItem> = [
    {
      title: 'Usuario',
      render: (_, row) => (
        <Space>
          <Avatar src={row.photo} style={{ background: '#1E3A8A' }} icon={<UserOutlined />} />
          <span>
            <Typography.Text strong>{row.fullName}</Typography.Text>
            <br />
            <Typography.Text type="secondary">{row.email}</Typography.Text>
          </span>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      render: (role: UserRoleName) => (
        <Tag color={roleColor[role]}>{ROLE_LABELS[role] || role}</Tag>
      ),
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Alta',
      dataIndex: 'date',
    },
    {
      title: 'Acciones',
      align: 'right',
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
          <Button size="small" icon={<KeyOutlined />} onClick={() => setPasswordUser(row)}>
            Cambiar clave
          </Button>
          <Popconfirm
            title="¿Eliminar este usuario?"
            description="La cuenta se desactiva y deja de aparecer en el listado."
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() =>
              deleteUser.mutate(row._id, {
                onSuccess: () => message.success('Usuario eliminado'),
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

  return (
    <div>
      <Breadcrumb
        items={[{ title: 'Inicio' }, { title: 'Gestión CEV' }, { title: 'Usuarios' }]}
        style={{ marginBottom: 8 }}
      />
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={2} style={{ margin: 0, color: '#00236F' }}>
            Usuarios
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Altas, edición y baja de cuentas. La contraseña se cambia en una acción aparte.
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
          Nuevo usuario
        </Button>
      </Space>

      <Card>
        <Input.Search
          allowClear
          placeholder="Buscar por nombre, correo o teléfono"
          onSearch={(value) => {
            setPage(1);
            setSearch(value);
          }}
          style={{ maxWidth: 360, marginBottom: 16 }}
        />
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={list.data?.results ?? []}
          loading={list.isFetching}
          scroll={{ x: 860 }}
          pagination={{
            current: list.data?.currentPage || page,
            total: list.data?.totalUSers || 0,
            pageSize: 10,
            onChange: setPage,
            showTotal: (total) => `${total} usuarios`,
          }}
        />
      </Card>

      <UserFormModal
        open={formOpen}
        editing={editing}
        roles={roles.data ?? []}
        loading={createUser.isPending || updateUser.isPending}
        onCancel={() => setFormOpen(false)}
        onSubmit={(values) => {
          if (editing) {
            updateUser.mutate(
              {
                _id: editing._id,
                name: values.name,
                lastName: values.lastName,
                phone: values.phone,
                role: values.role,
              },
              {
                onSuccess: () => {
                  message.success('Usuario actualizado');
                  setFormOpen(false);
                },
                onError: (error) => showError(error, 'No se pudo actualizar'),
              }
            );
            return;
          }
          createUser.mutate(
            {
              name: values.name,
              lastName: values.lastName,
              email: values.email || '',
              phone: values.phone,
              password: values.password || '',
              role: values.role,
            },
            {
              onSuccess: () => {
                message.success('Usuario creado');
                setFormOpen(false);
              },
              onError: (error) => showError(error, 'No se pudo crear el usuario'),
            }
          );
        }}
      />

      <ChangePasswordModal
        open={Boolean(passwordUser)}
        userName={passwordUser?.fullName}
        loading={changePassword.isPending}
        onCancel={() => setPasswordUser(null)}
        onSubmit={(password) => {
          if (!passwordUser) return;
          changePassword.mutate(
            { userId: passwordUser._id, password },
            {
              onSuccess: () => {
                message.success('Contraseña actualizada');
                setPasswordUser(null);
              },
              onError: (error) => showError(error, 'No se pudo cambiar la contraseña'),
            }
          );
        }}
      />
    </div>
  );
};

export default Users;
