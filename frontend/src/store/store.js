import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carReducer from './slices/carSlice';
import bookingReducer from './slices/bookingSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carReducer,
    bookings: bookingReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
