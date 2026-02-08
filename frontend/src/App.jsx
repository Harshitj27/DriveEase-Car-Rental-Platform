import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './store/slices/authSlice';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Cars from './pages/user/Cars';
import CarDetail from './pages/user/CarDetail';
import Bookings from './pages/user/Bookings';
import Profile from './pages/user/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageCars from './pages/admin/ManageCars';
import AddEditCar from './pages/admin/AddEditCar';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

// Common
import Loader from './components/common/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  if (loading) return <Loader />;

  return (
      <Routes>
        {/* ==================== USER ROUTES ==================== */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />

          {/* Auth (Guest Only) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/cars/add" element={<AddEditCar />} />
          <Route path="/admin/cars/edit/:id" element={<AddEditCar />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

export default App;
