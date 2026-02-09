import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaTachometerAlt, FaClipboardList, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaArrowLeft, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
    { to: '/admin/cars', label: 'Manage Cars', icon: FaCar },
    { to: '/admin/bookings', label: 'Bookings', icon: FaClipboardList },
    { to: '/admin/users', label: 'Users', icon: FaUsers },
  ];

  const isActive = (path, exact) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-400 to-accent-500 p-2.5 rounded-xl shadow-glow-sm">
            <FaCar className="text-white text-lg" />
          </div>
          <div>
            <span className="text-lg font-bold font-display text-white">DriveEase</span>
            <p className="text-xs text-primary-300/70">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-primary-600/30 to-primary-500/20 text-primary-300 border border-primary-500/30 shadow-glow-sm'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`text-base ${active ? 'text-primary-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-primary-300 transition-colors mb-2 rounded-xl hover:bg-white/5" onClick={() => setSidebarOpen(false)}>
          <FaArrowLeft className="text-xs" /> Back to Site
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 mt-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-surface-900 via-primary-950 to-surface-950 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-surface-900 via-primary-950 to-surface-950 z-40 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <FaBars className="text-xl text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-display text-gray-800 hidden sm:block">
                {navItems.find((n) => isActive(n.to, n.exact))?.label || 'Admin'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {location.pathname === '/admin/cars' && (
                <Link to="/admin/cars/add" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                  <FaPlus className="text-xs" /> Add Car
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
