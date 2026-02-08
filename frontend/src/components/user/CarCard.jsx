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
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/cars/${car._id}`)}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          {car.isAvailable ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-unavailable">Booked</span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="text-xs font-semibold text-gray-800">{car.rating?.toFixed(1)}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
        <div className="absolute bottom-3 left-3">
          <span className="text-white text-xs bg-primary-600/80 px-2 py-0.5 rounded-full">{car.category}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{car.brand} {car.name}</h3>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FaGasPump /> {car.fuelType}</span>
          <span className="flex items-center gap-1"><FaCog /> {car.transmission}</span>
          <span className="flex items-center gap-1"><FaUsers /> {car.seats} seats</span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <FaMapMarkerAlt className="text-primary-500" />
          <span>{car.city}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-primary-700">{formatINR(car.pricePerDay)}</span>
            <span className="text-xs text-gray-400 ml-1">/day</span>
          </div>
          <button className="btn-primary text-sm py-1.5 px-4">Book Now</button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
