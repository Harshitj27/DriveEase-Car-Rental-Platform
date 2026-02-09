import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings, updateBookingStatus } from '../../store/slices/adminSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { formatINR, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

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

const PaymentBadge = ({ status }) => {
  const styles = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-purple-100 text-purple-700',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const ManageBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState(null);
  const perPage = 10;

  useEffect(() => {
    dispatch(fetchAdminBookings());
  }, [dispatch]);

  const filteredBookings = (bookings || []).filter((b) => {
    const matchSearch =
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.car?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || b.bookingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / perPage);
  const paginated = filteredBookings.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await dispatch(updateBookingStatus({ id: bookingId, status: newStatus })).unwrap();
      toast.success(`Booking ${newStatus} successfully`);
      if (detailModal?._id === bookingId) {
        setDetailModal((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  if (loading && !bookings?.length) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display text-gray-900">Manage Bookings</h2>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, car, or booking ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 input-field"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length > 0 ? (
                paginated.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      #{booking._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{booking.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{booking.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.car?.brand} {booking.car?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(booking.pickupDate)}</div>
                      <div className="text-xs">to {formatDate(booking.dropDate)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatINR(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.bookingStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDetailModal(booking)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {booking.bookingStatus === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                            className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                          >
                            Complete
                          </button>
                        )}
                        {(booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed') && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filteredBookings.length)} of {filteredBookings.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium ${page === currentPage ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow-sm' : 'border border-gray-200 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDetailModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
                Booking #{detailModal._id.slice(-6).toUpperCase()}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium">{detailModal.user?.name}</p>
                    <p className="text-xs text-gray-400">{detailModal.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Car</p>
                    <p className="font-medium">{detailModal.car?.brand} {detailModal.car?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pickup Date</p>
                    <p className="font-medium">{formatDate(detailModal.pickupDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Drop Date</p>
                    <p className="font-medium">{formatDate(detailModal.dropDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Days</p>
                    <p className="font-medium">{detailModal.totalDays}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-semibold text-lg">{formatINR(detailModal.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Booking Status</p>
                    <StatusBadge status={detailModal.bookingStatus} />
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <PaymentBadge status={detailModal.paymentStatus} />
                  </div>
                  {detailModal.pickupCity && (
                    <div>
                      <p className="text-gray-500">Pickup City</p>
                      <p className="font-medium">{detailModal.pickupCity}</p>
                    </div>
                  )}
                  {detailModal.razorpayPaymentId && (
                    <div>
                      <p className="text-gray-500">Payment ID</p>
                      <p className="font-mono text-xs">{detailModal.razorpayPaymentId}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setDetailModal(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBookings;
