import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaMapMarkerAlt, FaShieldAlt, FaStar, FaArrowRight, FaGasPump, FaBolt } from 'react-icons/fa';

const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kolkata'];
const categories = [
  { name: 'Hatchback', icon: '🚗', desc: 'Perfect for city drives' },
  { name: 'Sedan', icon: '🚙', desc: 'Comfort meets elegance' },
  { name: 'SUV', icon: '🚐', desc: 'Conquer any terrain' },
  { name: 'Luxury', icon: '✨', desc: 'Premium experience' },
  { name: 'Electric', icon: '⚡', desc: 'Go green, go electric' },
];

const stats = [
  { label: 'Happy Customers', value: '50,000+' },
  { label: 'Cities', value: '9' },
  { label: 'Cars Available', value: '500+' },
  { label: 'Average Rating', value: '4.5★' },
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-ebd3fee65e78?w=1600&q=60')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/20 text-primary-200 rounded-full text-sm font-medium mb-6">
              <FaBolt /> India's #1 Car Rental Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Drive Your <span className="text-accent-400">Dream Car</span> Across India
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Choose from 500+ self-drive cars across 9 major Indian cities. Book in minutes, drive in style. Starting from just ₹1,100/day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cars" className="btn-accent text-base py-3 px-8 flex items-center gap-2">
                Browse Cars <FaArrowRight />
              </Link>
              <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white/20">
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Available Across <span className="text-primary-500">India</span></h2>
            <p className="text-gray-500 mt-2">Rent cars in 9 major cities</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/cars?city=${city}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <FaMapMarkerAlt className="text-primary-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">{city}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Browse by Category */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Find Your <span className="text-primary-500">Perfect Ride</span></h2>
              <p className="text-gray-500 mt-2">Browse by category</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/cars?category=${cat.name}`}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all group border border-gray-100 hover:border-primary-200"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why DriveEase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose <span className="text-primary-500">DriveEase</span>?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaCar, title: '500+ Cars', desc: 'From budget hatchbacks to luxury sedans. Maruti, Hyundai, Tata, BMW and more.' },
              { icon: FaShieldAlt, title: 'Fully Insured', desc: 'All cars come with comprehensive insurance and 24/7 roadside assistance across India.' },
              { icon: FaStar, title: 'Best Prices', desc: 'Transparent pricing in ₹. No hidden charges. Free cancellation up to 24 hours before pickup.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="text-primary-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Hit the Road?</h2>
            <p className="text-primary-100 text-lg mb-8">Join 50,000+ happy customers. Book your perfect car in under 2 minutes.</p>
            <Link to="/cars" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors text-lg">
              Explore Cars <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
