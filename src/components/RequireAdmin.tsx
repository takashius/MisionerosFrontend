import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/useAuth';

const RequireAdmin = () => {
  const { token, isAdmin } = useAuth();

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
