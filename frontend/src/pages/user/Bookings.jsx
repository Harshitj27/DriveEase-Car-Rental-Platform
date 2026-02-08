import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../../store/slices/bookingSlice';
import { motion } from 'framer-motion';
import { FaCar, FaCalendar, FaTimes } from 'react-icons/fa';
import { formatINR, formatDate, getStatusColor } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, pagination } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings({}));
  }, [dispatch]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const result = await dispatch(cancelBooking({ id: bookingId, reason: 'Cancelled by user' }));
    if (cancelBooking.fulfilled.match(result)) {
      toast.success('Booking cancelled');
      dispatch(fetchMyBookings({}));
    } else {
      toast.error(result.payload || 'Failed to cancel');
    }
  };

  if (loading) return <Loader text="Loading bookings..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No bookings yet</h3>
          <p className="text-gray-400 mt-2">Start by browsing cars and making your first booking</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="sm:flex">
                <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                  <img
                    src={booking.car?.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&q=60'}
                    alt={booking.car?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{booking.car?.brand} {booking.car?.name}</h3>
                      <p className="text-sm text-gray-500">{booking.pickupCity} • {booking.car?.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><FaCalendar className="text-primary-500" /> {formatDate(booking.pickupDate)} → {formatDate(booking.dropDate)}</span>
                    <span className="font-bold text-primary-700">{formatINR(booking.totalAmount)}</span>
                    <span className="text-gray-400">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <p className="text-xs text-gray-400">ID: {booking._id?.slice(-8)}</p>
                    {['pending', 'confirmed'].includes(booking.bookingStatus) && (
                      <button onClick={() => handleCancel(booking._id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">
                        <FaTimes className="text-xs" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
