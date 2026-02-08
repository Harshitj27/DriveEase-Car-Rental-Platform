const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validate');

router.use(protect);

router.post('/', bookingValidation, createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
