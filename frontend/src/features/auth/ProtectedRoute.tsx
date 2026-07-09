import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/** Redirects unauthenticated visitors to the admin login page. */
export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}
