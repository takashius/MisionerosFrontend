import { useEffect } from 'react';
import { Form, Input, Modal, Typography } from 'antd';

type ChangePasswordModalProps = {
  open: boolean;
  userName?: string;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (password: string) => void;
};

const ChangePasswordModal = ({
  open,
  userName,
  loading,
  onCancel,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [form] = Form.useForm<{ password: string; confirm: string }>();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      title="Cambiar contraseña"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
      okText="Actualizar clave"
    >
      <Typography.Paragraph type="secondary">
        Define una clave nueva para {userName || 'este usuario'}. No se edita junto con los datos
        del perfil.
      </Typography.Paragraph>
      <Form
        layout="vertical"
        form={form}
        onFinish={({ password }) => onSubmit(password)}
      >
        <Form.Item
          name="password"
          label="Nueva contraseña"
          rules={[
            { required: true, message: 'Ingresa la nueva contraseña' },
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
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
