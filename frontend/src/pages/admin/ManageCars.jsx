import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCars, deleteCar } from '../../store/slices/adminSlice';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatINR } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const ManageCars = () => {
  const dispatch = useDispatch();
  const { cars, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const perPage = 10;

  const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Chandigarh'];
  const categories = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'];

  useEffect(() => {
    dispatch(fetchAdminCars());
  }, [dispatch]);

  const filteredCars = (cars || []).filter((car) => {
    const matchSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase());
    const matchCity = !filterCity || car.city === filterCity;
    const matchCategory = !filterCategory || car.category === filterCategory;
    return matchSearch && matchCity && matchCategory;
  });

  const totalPages = Math.ceil(filteredCars.length / perPage);
  const paginatedCars = filteredCars.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await dispatch(deleteCar(deleteModal._id)).unwrap();
      toast.success('Car deleted successfully');
      setDeleteModal(null);
    } catch (err) {
      toast.error(err || 'Failed to delete car');
    }
  };

  if (loading && !cars?.length) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Cars</h2>
        <Link
          to="/admin/cars/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <FiPlus /> Add New Car
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCity}
            onChange={(e) => { setFilterCity(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price/Day</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car) => (
                  <motion.tr
                    key={car._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images?.[0]?.url || '/logo.svg'}
                          alt={car.name}
                          className="w-12 h-8 rounded object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{car.name}</p>
                          <p className="text-xs text-gray-500">{car.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                        {car.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{car.city}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatINR(car.pricePerDay)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">⭐ {car.rating?.toFixed(1) || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/cars/edit/${car._id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(car)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No cars found
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
              Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filteredCars.length)} of {filteredCars.length}
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
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === currentPage ? 'bg-primary-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
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

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Car</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deleteModal.brand} {deleteModal.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCars;
