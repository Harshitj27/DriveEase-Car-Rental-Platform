import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, fetchCars } from '../../store/slices/carSlice';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kolkata'];
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const transmissions = ['Manual', 'Automatic'];
const categories = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'];

const SearchFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.cars);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(fetchCars({ ...localFilters, page: 1 }));
    setShowMobileFilters(false);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(fetchCars({ page: 1 }));
    setShowMobileFilters(false);
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search cars..."
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field pl-10"
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <select value={localFilters.city} onChange={(e) => handleChange('city', e.target.value)} className="input-field">
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select value={localFilters.category} onChange={(e) => handleChange('category', e.target.value)} className="input-field">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
        <select value={localFilters.fuelType} onChange={(e) => handleChange('fuelType', e.target.value)} className="input-field">
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
        <select value={localFilters.transmission} onChange={(e) => handleChange('transmission', e.target.value)} className="input-field">
          <option value="">All</option>
          {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min ₹</label>
          <input type="number" placeholder="500" value={localFilters.minPrice} onChange={(e) => handleChange('minPrice', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max ₹</label>
          <input type="number" placeholder="10000" value={localFilters.maxPrice} onChange={(e) => handleChange('maxPrice', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button onClick={applyFilters} className="btn-primary flex-1 text-sm">Apply Filters</button>
        <button onClick={handleReset} className="btn-secondary flex-1 text-sm">Reset</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setShowMobileFilters(true)} className="btn-secondary flex items-center gap-2 w-full justify-center">
          <FaFilter /> Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween' }} className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}><FaTimes /></button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 sticky top-24">
          <h3 className="text-lg font-bold font-display text-gray-900 mb-4 flex items-center gap-2"><FaFilter className="text-primary-500" /> Filters</h3>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
