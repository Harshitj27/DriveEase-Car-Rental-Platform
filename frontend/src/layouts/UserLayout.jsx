import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaBars, FaTimes, FaUser, FaSignOutAlt, FaHistory, FaChevronDown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Browse Cars' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-500 p-2 rounded-lg group-hover:bg-primary-600 transition-colors">
                <FaCar className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-primary-700">DriveEase</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons / Profile */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenu(!profileMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                    <FaChevronDown className="text-xs text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {profileMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
                        >
                          <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenu(false)}>
                            <FaHistory className="text-gray-400" /> My Bookings
                          </Link>
                          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenu(false)}>
                            <FaUser className="text-gray-400" /> Profile
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-gray-50" onClick={() => setProfileMenu(false)}>
                              <FaCar className="text-primary-500" /> Admin Panel
                            </Link>
                          )}
                          <hr className="my-1" />
                          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                            <FaSignOutAlt /> Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenu ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenu(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/bookings" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenu(false)}>My Bookings</Link>
                    <Link to="/profile" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileMenu(false)}>Profile</Link>
                    <button onClick={() => { handleLogout(); setMobileMenu(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileMenu(false)}>Login</Link>
                    <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileMenu(false)}>Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-500 p-2 rounded-lg"><FaCar className="text-white" /></div>
                <span className="text-xl font-bold">DriveEase</span>
              </div>
              <p className="text-gray-400 text-sm">India's premium car rental platform. Drive your dream car across 9 major cities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Cities</h4>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-400">
                {['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Kolkata'].map(c => (
                  <span key={c} className="hover:text-white transition-colors cursor-pointer">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <div className="space-y-1 text-sm text-gray-400">
                {['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'].map(c => (
                  <div key={c} className="hover:text-white transition-colors cursor-pointer">{c}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>support@driveease.in</p>
                <p>+91 98765 43210</p>
                <p>New Delhi, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} DriveEase India Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
