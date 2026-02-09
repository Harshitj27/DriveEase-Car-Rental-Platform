import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarById, checkCarAvailability, clearSelectedCar } from '../../store/slices/carSlice';
import { createBooking, createPaymentOrder, verifyPayment, clearCurrentBooking } from '../../store/slices/bookingSlice';
import { motion } from 'framer-motion';
import { FaStar, FaGasPump, FaCog, FaUsers, FaMapMarkerAlt, FaCalendar, FaCheck, FaTimes, FaShieldAlt, FaTachometerAlt } from 'react-icons/fa';
import { formatINR, formatDateInput, loadRazorpay } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const CarDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCar: car, loading, availability } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);
  const { loading: bookingLoading } = useSelector((state) => state.bookings);
  const [activeImage, setActiveImage] = useState(0);
  const [dates, setDates] = useState({ pickupDate: '', dropDate: '' });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    dispatch(fetchCarById(id));
    return () => { dispatch(clearSelectedCar()); dispatch(clearCurrentBooking()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (dates.pickupDate && dates.dropDate && car) {
      const pickup = new Date(dates.pickupDate);
      const drop = new Date(dates.dropDate);
      if (drop > pickup) {
        const days = Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24));
        setTotalDays(days);
        setTotalPrice(days * car.pricePerDay);
        dispatch(checkCarAvailability({ id, pickupDate: dates.pickupDate, dropDate: dates.dropDate }));
      }
    }
  }, [dates, car, dispatch, id]);

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    if (!dates.pickupDate || !dates.dropDate) { toast.error('Select pickup and drop dates'); return; }
    if (!availability?.available) { toast.error('Car is not available for selected dates'); return; }

    const bookingResult = await dispatch(createBooking({ carId: id, pickupDate: dates.pickupDate, dropDate: dates.dropDate }));
    if (!createBooking.fulfilled.match(bookingResult)) {
      toast.error(bookingResult.payload || 'Booking failed');
      return;
    }

    const booking = bookingResult.payload.booking;

    // Initiate payment
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Payment gateway failed to load'); return; }

    const orderResult = await dispatch(createPaymentOrder(booking._id));
    if (!createPaymentOrder.fulfilled.match(orderResult)) {
      toast.error('Failed to create payment order');
      return;
    }

    const { orderId, amount, keyId } = orderResult.payload;

    const options = {
      key: keyId,
      amount,
      currency: 'INR',
      name: 'DriveEase',
      description: `Booking: ${car.brand} ${car.name}`,
      order_id: orderId,
      handler: async (response) => {
        const verifyResult = await dispatch(verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId: booking._id,
        }));
        if (verifyPayment.fulfilled.match(verifyResult)) {
          toast.success('Booking confirmed! 🎉');
          navigate('/bookings');
        } else {
          toast.error('Payment verification failed');
        }
      },
      prefill: { name: user.name, email: user.email, contact: user.phoneNumber },
      theme: { color: '#6366f1' },
      modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading || !car) return <Loader text="Loading car details..." />;

  const today = formatDateInput(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:flex gap-8">
        {/* Left - Images */}
        <div className="lg:w-3/5">
          <div className="rounded-2xl overflow-hidden bg-gray-100 relative shadow-card">
            <img
              src={car.images?.[activeImage]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'}
              alt={`${car.brand} ${car.name}`}
              className="w-full h-72 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              {car.isAvailable ? <span className="badge-available text-sm">Available</span> : <span className="badge-unavailable text-sm">Unavailable</span>}
            </div>
          </div>

          {car.images?.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === i ? 'border-primary-500 shadow-glow-sm' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-bold font-display text-gray-900 mb-3">About this car</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>

            {car.features?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold font-display text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 px-3 py-1.5 rounded-xl text-sm border border-primary-100">
                      <FaCheck className="text-xs text-primary-500" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Booking Card */}
        <div className="lg:w-2/5 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-6 sticky top-24">
            <div className="mb-4">
              <h1 className="text-2xl font-bold font-display text-gray-900">{car.brand} {car.name}</h1>
              <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-lg font-medium">{car.category} • {car.year}</span>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <FaStar className="text-amber-400" />
              <span className="font-semibold">{car.rating?.toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({car.totalRatings} ratings)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: FaGasPump, label: car.fuelType },
                { icon: FaCog, label: car.transmission },
                { icon: FaUsers, label: `${car.seats} Seats` },
                { icon: FaMapMarkerAlt, label: car.city },
                { icon: FaTachometerAlt, label: car.mileage || 'N/A' },
                { icon: FaShieldAlt, label: 'Insured' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-surface-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <item.icon className="text-primary-500 text-sm" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="text-3xl font-bold gradient-text">{formatINR(car.pricePerDay)}<span className="text-sm font-normal text-gray-400">/day</span></div>
            </div>

            {/* Date Pickers */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"><FaCalendar className="inline mr-1" /> Pickup Date</label>
                <input type="date" min={today} value={dates.pickupDate} onChange={(e) => setDates({ ...dates, pickupDate: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"><FaCalendar className="inline mr-1" /> Drop Date</label>
                <input type="date" min={dates.pickupDate || today} value={dates.dropDate} onChange={(e) => setDates({ ...dates, dropDate: e.target.value })} className="input-field" />
              </div>
            </div>

            {/* Availability & Price */}
            {availability && (
              <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${availability.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {availability.available ? <FaCheck /> : <FaTimes />}
                <span className="text-sm font-medium">{availability.message}</span>
              </div>
            )}

            {totalDays > 0 && (
              <div className="bg-surface-50 rounded-xl p-4 mb-4 border border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatINR(car.pricePerDay)} × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                  <span>{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span className="gradient-text">{formatINR(totalPrice)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={bookingLoading || !dates.pickupDate || !dates.dropDate || (availability && !availability.available)}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? 'Processing...' : user ? 'Book & Pay Now' : 'Login to Book'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarDetail;
