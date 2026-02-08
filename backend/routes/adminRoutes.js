const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getDashboardStats,
  addCar,
  updateCar,
  deleteCar,
  getAllCarsAdmin,
  removeCarImage,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  toggleBlockUser,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Car management
router.get('/cars', getAllCarsAdmin);
router.post('/cars', upload.array('images', 5), addCar);
router.put('/cars/:id', upload.array('images', 5), updateCar);
router.delete('/cars/:id', deleteCar);
router.delete('/cars/:id/image', removeCarImage);

// Booking management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);

module.exports = router;
