import { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { RoleOption, UserListItem, UserRoleName } from '@app-types/users';
import { ROLE_LABELS } from '@app-types/users';

type UserFormValues = {
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: UserRoleName;
  password?: string;
  confirm?: string;
};

type UserFormModalProps = {
  open: boolean;
  editing: UserListItem | null;
  roles: RoleOption[];
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
};

const UserFormModal = ({
  open,
  editing,
  roles,
  loading,
  onCancel,
  onSubmit,
}: UserFormModalProps) => {
  const [form] = Form.useForm<UserFormValues>();
  const isEdit = Boolean(editing);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        lastName: editing.lastName,
        email: editing.email,
        phone: editing.phone,
        role: editing.role,
      });
      return;
    }
    form.resetFields();
  }, [open, editing, form]);

  return (
    <Modal
      title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
      okText={isEdit ? 'Guardar' : 'Crear'}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Apellido">
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Correo"
          rules={[{ required: !isEdit, type: 'email', message: 'Correo válido' }]}
        >
          <Input disabled={isEdit} autoComplete="off" />
        </Form.Item>
        <Form.Item name="phone" label="Teléfono">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Rol" rules={[{ required: true, message: 'Selecciona un rol' }]}>
          <Select
            options={roles.map((role) => ({
              value: role.name,
              label: ROLE_LABELS[role.name] || role.description,
              disabled: role.disabled,
            }))}
          />
        </Form.Item>
        {!isEdit && (
          <>
            <Form.Item
              name="password"
              label="Contraseña inicial"
              rules={[
                { required: true, message: 'La contraseña es obligatoria' },
                { min: 8, message: 'Mínimo 8 caracteres' },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirmar contraseña"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Confirma la contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UserFormModal;
