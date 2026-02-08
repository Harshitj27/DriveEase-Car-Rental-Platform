import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, toggleBlockUser } from '../../store/slices/adminSlice';
import { motion } from 'framer-motion';
import { FiSearch, FiShield, FiUser, FiChevronLeft, FiChevronRight, FiLock, FiUnlock } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const filteredUsers = (users || []).filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phoneNumber?.includes(search);
    const matchRole = !filterRole || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginated = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await dispatch(toggleBlockUser(userId)).unwrap();
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
    } catch (err) {
      toast.error(err || 'Failed to update user');
    }
  };

  if (loading && !users?.length) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {users?.filter((u) => !u.isBlocked).length || 0}
          </p>
          <p className="text-sm text-gray-500">Active Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {users?.filter((u) => u.isBlocked).length || 0}
          </p>
          <p className="text-sm text-gray-500">Blocked Users</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length > 0 ? (
                paginated.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${user.role === 'admin' ? 'bg-purple-500' : 'bg-primary-500'}`}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role === 'admin' ? <FiShield className="w-3 h-3" /> : <FiUser className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            user.isBlocked
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {user.isBlocked ? (
                            <>
                              <FiUnlock className="w-3 h-3" /> Unblock
                            </>
                          ) : (
                            <>
                              <FiLock className="w-3 h-3" /> Block
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No users found
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
              Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filteredUsers.length)} of {filteredUsers.length}
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
    </div>
  );
};

export default ManageUsers;
