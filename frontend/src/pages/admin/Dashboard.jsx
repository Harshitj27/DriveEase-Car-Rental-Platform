import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/adminSlice';
import { motion } from 'framer-motion';
import { FiUsers, FiTruck, FiCalendar, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { formatINR, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-6 hover:shadow-card-hover transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold font-display text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !dashboard) return <Loader />;

  const dashboardStats = dashboard;

  const { totalUsers, totalCars, totalBookings, totalRevenue, recentBookings, bookingsByStatus, mostRentedCar, monthlyRevenue } = dashboardStats;

  const stats = [
    { title: 'Total Revenue', value: formatINR(totalRevenue || 0), icon: FiDollarSign, color: 'bg-gradient-to-br from-emerald-500 to-green-600' },
    { title: 'Total Bookings', value: totalBookings || 0, icon: FiCalendar, color: 'bg-gradient-to-br from-primary-500 to-primary-700' },
    { title: 'Total Cars', value: totalCars || 0, icon: FiTruck, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { title: 'Total Users', value: totalUsers || 0, icon: FiUsers, color: 'bg-gradient-to-br from-violet-500 to-purple-700' },
  ];

  const maxRevenue = monthlyRevenue ? Math.max(...monthlyRevenue.map((m) => m.revenue), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-gray-100/80 p-6"
        >
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary-500" /> Monthly Revenue
          </h3>
          {monthlyRevenue && monthlyRevenue.length > 0 ? (
            <div className="flex items-end gap-2 h-48">
              {monthlyRevenue.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {formatINR(item.revenue)}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md min-h-[4px]"
                  />
                  <span className="text-[10px] text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No revenue data yet</p>
          )}
        </motion.div>

        {/* Booking Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-6"
        >
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Bookings by Status</h3>
          <div className="space-y-3">
            {bookingsByStatus && bookingsByStatus.length > 0 ? (
              bookingsByStatus.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <StatusBadge status={item._id} />
                  <span className="text-lg font-bold text-gray-800">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No bookings yet</p>
            )}
          </div>

          {mostRentedCar && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Most Rented Car</p>
              <p className="font-semibold text-gray-900">{mostRentedCar.name}</p>
              <p className="text-sm text-gray-500">{mostRentedCar.totalBookings} bookings</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100/80">
          <h3 className="text-lg font-semibold font-display text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      #{booking._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.car?.brand} {booking.car?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(booking.pickupDate)} - {formatDate(booking.dropDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatINR(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
