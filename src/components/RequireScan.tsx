import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/useAuth';

const RequireScan = () => {
  const { token, isStaff, canScan } = useAuth();

  if (!token || !isStaff) {
    return <Navigate to="/login" replace />;
  }

  if (!canScan) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default RequireScan;
