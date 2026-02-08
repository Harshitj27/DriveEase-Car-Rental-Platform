const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { calculateDays } = require('../utils/helpers');
const { sendBookingCancellation } = require('../services/emailService');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { carId, pickupDate, dropDate } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.isAvailable) {
      return res.status(400).json({ success: false, message: 'Car is not available for booking' });
    }

    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (pickup < now) {
      return res.status(400).json({ success: false, message: 'Pickup date cannot be in the past' });
    }

    if (drop <= pickup) {
      return res.status(400).json({ success: false, message: 'Drop date must be after pickup date' });
    }

    const isOverlapping = await Booking.checkOverlap(car._id, pickupDate, dropDate);
    if (isOverlapping) {
      return res.status(400).json({ success: false, message: 'Car is already booked for the selected dates' });
    }

    const totalDays = calculateDays(pickupDate, dropDate);
    const totalAmount = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      car: car._id,
      pickupDate: pickup,
      dropDate: drop,
      totalDays,
      totalAmount,
      pickupCity: car.city,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id).populate('car', 'name brand images city').populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: populatedBooking },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.bookingStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('car', 'name brand images city pricePerDay category')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'name brand images city pricePerDay fuelType transmission seats category')
      .populate('user', 'name email phoneNumber');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: { booking } });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('car', 'name brand images city')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['cancelled', 'completed'].includes(booking.bookingStatus)) {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.bookingStatus}` });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason || '';
    booking.cancelledAt = new Date();

    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    // Send cancellation email
    sendBookingCancellation(booking, booking.user, booking.car);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };
