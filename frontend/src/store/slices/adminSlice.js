import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchDashboardStats = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchAdminCars = createAsyncThunk('admin/fetchCars', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/cars', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cars');
  }
});

export const addCar = createAsyncThunk('admin/addCar', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add car');
  }
});

export const updateCar = createAsyncThunk('admin/updateCar', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update car');
  }
});

export const deleteCar = createAsyncThunk('admin/deleteCar', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/cars/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete car');
  }
});

export const fetchAdminBookings = createAsyncThunk('admin/fetchBookings', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/bookings', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const updateBookingStatus = createAsyncThunk('admin/updateBookingStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/bookings/${id}/status`, { status });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const toggleBlockUser = createAsyncThunk('admin/toggleBlock', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/users/${id}/block`);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    cars: [],
    bookings: [],
    users: [],
    carsPagination: {},
    bookingsPagination: {},
    usersPagination: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.dashboard = action.payload; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAdminCars.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminCars.fulfilled, (state, action) => { state.loading = false; state.cars = action.payload.cars; state.carsPagination = action.payload.pagination; })
      .addCase(fetchAdminCars.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addCar.fulfilled, (state, action) => { state.cars.unshift(action.payload.car); })
      .addCase(updateCar.fulfilled, (state, action) => { state.cars = state.cars.map(c => c._id === action.payload.car._id ? action.payload.car : c); })
      .addCase(deleteCar.fulfilled, (state, action) => { state.cars = state.cars.filter(c => c._id !== action.payload); })
      .addCase(fetchAdminBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload.bookings; state.bookingsPagination = action.payload.pagination; })
      .addCase(fetchAdminBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => { state.bookings = state.bookings.map(b => b._id === action.payload.booking._id ? action.payload.booking : b); })
      .addCase(fetchAdminUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload.users; state.usersPagination = action.payload.pagination; })
      .addCase(fetchAdminUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(toggleBlockUser.fulfilled, (state, action) => { state.users = state.users.map(u => u._id === action.payload.user._id ? action.payload.user : u); });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
