import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaGasPump, FaCog, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { formatINR } from '../../utils/helpers';

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=60';

  return (
    <motion.div
      className="card cursor-pointer group"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/cars/${car._id}`)}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          {car.isAvailable ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-unavailable">Booked</span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <FaStar className="text-amber-400 text-xs" />
          <span className="text-xs font-bold text-gray-800">{car.rating?.toFixed(1)}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-white text-xs bg-primary-600/80 backdrop-blur-sm px-2.5 py-1 rounded-lg font-medium border border-white/10">{car.category}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold font-display text-gray-900 text-lg leading-tight">{car.brand} {car.name}</h3>

        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FaGasPump className="text-primary-400" /> {car.fuelType}</span>
          <span className="flex items-center gap-1"><FaCog className="text-primary-400" /> {car.transmission}</span>
          <span className="flex items-center gap-1"><FaUsers className="text-primary-400" /> {car.seats} seats</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
          <FaMapMarkerAlt className="text-accent-500" />
          <span>{car.city}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold gradient-text">{formatINR(car.pricePerDay)}</span>
            <span className="text-xs text-gray-400 ml-1">/day</span>
          </div>
          <button className="btn-primary text-sm py-2 px-5">Book Now</button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
