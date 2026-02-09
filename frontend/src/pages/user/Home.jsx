import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaMapMarkerAlt, FaShieldAlt, FaStar, FaArrowRight, FaGasPump, FaBolt } from 'react-icons/fa';

const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kolkata'];
const categories = [
  { name: 'Hatchback', icon: '🚗', desc: 'Perfect for city drives', color: 'from-blue-500/10 to-indigo-500/10 border-blue-200/50' },
  { name: 'Sedan', icon: '🚙', desc: 'Comfort meets elegance', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50' },
  { name: 'SUV', icon: '🚐', desc: 'Conquer any terrain', color: 'from-amber-500/10 to-orange-500/10 border-amber-200/50' },
  { name: 'Luxury', icon: '✨', desc: 'Premium experience', color: 'from-purple-500/10 to-pink-500/10 border-purple-200/50' },
  { name: 'Electric', icon: '⚡', desc: 'Go green, go electric', color: 'from-green-500/10 to-emerald-500/10 border-green-200/50' },
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
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-surface-950 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-ebd3fee65e78?w=1600&q=60')] bg-cover bg-center opacity-[0.07]" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/20 text-primary-200 rounded-full text-sm font-medium mb-6 border border-primary-500/20 backdrop-blur-sm">
              <FaBolt className="text-accent-400" /> India's #1 Car Rental Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-display text-white leading-tight">
              Drive Your <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">Dream Car</span> Across India
            </h1>
            <p className="mt-6 text-lg text-gray-300/90 leading-relaxed">
              Choose from 500+ self-drive cars across 9 major Indian cities. Book in minutes, drive in style. Starting from just ₹1,100/day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cars" className="btn-accent text-base py-3.5 px-8 flex items-center gap-2 shadow-glow-accent">
                Browse Cars <FaArrowRight />
              </Link>
              <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm hover:shadow-lg">
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:bg-white/[0.12] transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold font-display text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h2 className="section-title">Available Across <span className="gradient-text">India</span></h2>
            <p className="text-gray-500 mt-3 text-lg">Rent cars in 9 major cities</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {cities.map((city, idx) => (
              <motion.div 
                key={city}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/cars?city=${city}`}
                  className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-100 transition-all duration-300 group-hover:shadow-glow-sm">
                    <FaMapMarkerAlt className="text-primary-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{city}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Browse by Category */}
      <section className="bg-gradient-to-b from-surface-100 to-surface-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-12">
              <h2 className="section-title">Find Your <span className="gradient-text">Perfect Ride</span></h2>
              <p className="text-gray-500 mt-3 text-lg">Browse by category</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={`/cars?category=${cat.name}`}
                    className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center hover:shadow-card-hover transition-all duration-500 group border block hover:-translate-y-1`}
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                    <h3 className="font-bold font-display text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why DriveEase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose <span className="gradient-text">DriveEase</span>?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaCar, title: '500+ Cars', desc: 'From budget hatchbacks to luxury sedans. Maruti, Hyundai, Tata, BMW and more.', gradient: 'from-primary-500 to-primary-600' },
              { icon: FaShieldAlt, title: 'Fully Insured', desc: 'All cars come with comprehensive insurance and 24/7 roadside assistance across India.', gradient: 'from-emerald-500 to-teal-600' },
              { icon: FaStar, title: 'Best Prices', desc: 'Transparent pricing in ₹. No hidden charges. Free cancellation up to 24 hours before pickup.', gradient: 'from-accent-500 to-amber-600' },
            ].map((item, idx) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover border border-gray-100/80 transition-all duration-500 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                  <item.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Ready to Hit the Road?</h2>
            <p className="text-primary-100 text-lg mb-8">Join 50,000+ happy customers. Book your perfect car in under 2 minutes.</p>
            <Link to="/cars" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-10 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              Explore Cars <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
