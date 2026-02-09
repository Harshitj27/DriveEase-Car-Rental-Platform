import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900">My Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 btn-primary text-sm"
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-20" />
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <span className="text-3xl font-bold gradient-text">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white mt-3">{user?.name}</h2>
            <span className="inline-block mt-1 bg-white/20 text-white text-xs px-3 py-0.5 rounded-full capitalize backdrop-blur-sm border border-white/10">{user?.role}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center">
              <FaUser className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center">
              <FaEnvelope className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="font-semibold text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center">
              <FaPhone className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-900">+91 {user?.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center">
              <FaCalendar className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="font-semibold text-gray-900">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      {editing && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-6 bg-white rounded-2xl shadow-card border border-gray-100/80 p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold font-display text-gray-900">Edit Profile</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              placeholder="10-digit mobile number"
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default Profile;
