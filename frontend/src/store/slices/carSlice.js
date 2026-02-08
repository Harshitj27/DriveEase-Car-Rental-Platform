import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCars = createAsyncThunk('cars/fetchCars', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cars', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cars');
  }
});

export const fetchCarById = createAsyncThunk('cars/fetchCarById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/cars/${id}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch car');
  }
});

export const checkCarAvailability = createAsyncThunk('cars/checkAvailability', async ({ id, pickupDate, dropDate }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/cars/${id}/availability`, { params: { pickupDate, dropDate } });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to check availability');
  }
});

export const fetchCities = createAsyncThunk('cars/fetchCities', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cars/cities/list');
    return data.data.cities;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cities');
  }
});

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    cars: [],
    selectedCar: null,
    cities: [],
    pagination: { total: 0, page: 1, pages: 1 },
    filters: { city: '', fuelType: '', transmission: '', category: '', minPrice: '', maxPrice: '', search: '' },
    availability: null,
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters: (state) => { state.filters = { city: '', fuelType: '', transmission: '', category: '', minPrice: '', maxPrice: '', search: '' }; },
    clearSelectedCar: (state) => { state.selectedCar = null; state.availability = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => { state.loading = true; })
      .addCase(fetchCars.fulfilled, (state, action) => { state.loading = false; state.cars = action.payload.cars; state.pagination = action.payload.pagination; })
      .addCase(fetchCars.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCarById.pending, (state) => { state.loading = true; })
      .addCase(fetchCarById.fulfilled, (state, action) => { state.loading = false; state.selectedCar = action.payload.car; })
      .addCase(fetchCarById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(checkCarAvailability.fulfilled, (state, action) => { state.availability = action.payload; })
      .addCase(fetchCities.fulfilled, (state, action) => { state.cities = action.payload; });
  },
});

export const { setFilters, resetFilters, clearSelectedCar } = carSlice.actions;
export default carSlice.reducer;
