import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addCar, updateCar, fetchAdminCars } from '../../store/slices/adminSlice';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'MG', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi'];
const categories = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'];
const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Chandigarh'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const transmissionTypes = ['Manual', 'Automatic'];

const AddEditCar = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, loading } = useSelector((state) => state.admin);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    city: '',
    pricePerDay: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: '5',
    description: '',
    features: '',
    isAvailable: true,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && (!cars || cars.length === 0)) {
      dispatch(fetchAdminCars());
    }
  }, [isEdit, cars, dispatch]);

  useEffect(() => {
    if (isEdit && cars?.length > 0) {
      const car = cars.find((c) => c._id === id);
      if (car) {
        setForm({
          name: car.name || '',
          brand: car.brand || '',
          category: car.category || '',
          city: car.city || '',
          pricePerDay: car.pricePerDay || '',
          fuelType: car.fuelType || 'Petrol',
          transmission: car.transmission || 'Manual',
          seats: car.seats || '5',
          description: car.description || '',
          features: car.features?.join(', ') || '',
          isAvailable: car.isAvailable !== false,
        });
        setExistingImages(car.images || []);
      }
    }
  }, [isEdit, id, cars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.category || !form.city || !form.pricePerDay) {
      toast.error('Please fill all required fields');
      return;
    }
    if (images.length === 0 && existingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'features') {
        formData.append(key, val);
      } else {
        formData.append(key, val);
      }
    });
    images.forEach((img) => formData.append('images', img));
    if (isEdit) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    try {
      if (isEdit) {
        await dispatch(updateCar({ id, formData })).unwrap();
        toast.success('Car updated successfully!');
      } else {
        await dispatch(addCar(formData)).unwrap();
        toast.success('Car added successfully!');
      }
      navigate('/admin/cars');
    } catch (err) {
      toast.error(err || `Failed to ${isEdit ? 'update' : 'add'} car`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !cars?.length) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={() => navigate('/admin/cars')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <FiArrowLeft /> Back to Cars
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Car' : 'Add New Car'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Swift, Creta, Nexon"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day (₹) *</label>
              <input
                type="number"
                name="pricePerDay"
                value={form.pricePerDay}
                onChange={handleChange}
                placeholder="e.g. 1500"
                min="100"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {transmissionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <input
                type="number"
                name="seats"
                value={form.seats}
                onChange={handleChange}
                min="2"
                max="12"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description & Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the car..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <input
              type="text"
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="AC, Power Steering, Music System, GPS"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Availability */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Available for booking</span>
          </label>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Images * <span className="text-gray-400">(Max 5)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-300">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {existingImages.length + images.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <FiUpload className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/cars')}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
            >
              <FiSave />
              {submitting ? 'Saving...' : isEdit ? 'Update Car' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEditCar;
