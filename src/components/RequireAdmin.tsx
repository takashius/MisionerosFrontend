import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/useAuth';

const RequireAdmin = () => {
  const { token, isStaff, isLogistics } = useAuth();

  if (!token || !isStaff) {
    return <Navigate to="/login" replace />;
  }

  if (isLogistics) {
    return <Navigate to="/escaner" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
