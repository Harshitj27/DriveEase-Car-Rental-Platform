import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return children;
};
