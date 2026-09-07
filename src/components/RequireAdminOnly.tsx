import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';

const RequireAdminOnly = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default RequireAdminOnly;
