import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookings', bookingData);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Booking failed');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMine', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings/my-bookings', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const fetchBookingById = createAsyncThunk('bookings/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/bookings/${id}/cancel`, { reason });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
  }
});

export const createPaymentOrder = createAsyncThunk('bookings/createOrder', async (bookingId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payments/create-order', { bookingId });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment failed');
  }
});

export const verifyPayment = createAsyncThunk('bookings/verifyPayment', async (paymentData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payments/verify', paymentData);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    paymentOrder: null,
    pagination: { total: 0, page: 1, pages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingError: (state) => { state.error = null; },
    clearCurrentBooking: (state) => { state.currentBooking = null; state.paymentOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => { state.loading = false; state.currentBooking = action.payload.booking; })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload.bookings; state.pagination = action.payload.pagination; })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBookingById.fulfilled, (state, action) => { state.currentBooking = action.payload.booking; })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload.booking;
        state.bookings = state.bookings.map(b => b._id === action.payload.booking._id ? action.payload.booking : b);
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => { state.paymentOrder = action.payload; })
      .addCase(verifyPayment.fulfilled, (state, action) => { state.currentBooking = action.payload.booking; state.paymentOrder = null; });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
