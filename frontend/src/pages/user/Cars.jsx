import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchCars } from '../../store/slices/carSlice';
import CarCard from '../../components/user/CarCard';
import SearchFilters from '../../components/user/SearchFilters';
import CarCardSkeleton from '../../components/common/CarCardSkeleton';
import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';

const Cars = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { cars, loading, pagination, filters } = useSelector((state) => state.cars);

  useEffect(() => {
    const params = {
      city: searchParams.get('city') || filters.city,
      category: searchParams.get('category') || filters.category,
      fuelType: filters.fuelType,
      transmission: filters.transmission,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      page: 1,
    };
    dispatch(fetchCars(params));
  }, [dispatch, searchParams]);

  const handlePageChange = (page) => {
    dispatch(fetchCars({ ...filters, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
        <p className="text-gray-500 mt-1">{pagination.total} cars available across India</p>
      </div>

      <div className="lg:flex gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <SearchFilters />
        </div>

        {/* Car Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                        pagination.page === i + 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">No cars found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
