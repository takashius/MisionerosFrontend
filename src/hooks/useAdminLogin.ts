import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@api/auth';
import { useAuth } from '@context/useAuth';
import { isStaffRole } from '@app-types/auth';
import { wasErrorToastShown } from '@utils/apiAuthError';
import { getLoginErrorMessage } from '@utils/getLoginErrorMessage';

export const useAdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const mutation = useLogin();

  const loginAdmin = (values: { email: string; password: string }) => {
    mutation.mutate(values, {
      onSuccess(data) {
        if (!isStaffRole(data.role)) {
          message.error('Este acceso es solo para el personal CEV (admin, coordinador o logística).');
          return;
        }
        login(data);
        navigate('/admin');
      },
      onError(error) {
        if (wasErrorToastShown(error)) return;
        message.error(getLoginErrorMessage(error));
      },
    });
  };

  return { loginAdmin, isPending: mutation.isPending };
};
