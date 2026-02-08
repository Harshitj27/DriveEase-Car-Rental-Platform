const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { sendBookingConfirmation } = require('../services/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('car', 'name brand');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Payment already completed' });
    }

    const options = {
      amount: Math.round(booking.totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        carName: `${booking.car.brand} ${booking.car.name}`,
      },
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('car', 'name brand images city pricePerDay')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    await booking.save();

    // Send confirmation email
    sendBookingConfirmation(booking, booking.user, booking.car);

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Razorpay key (for frontend)
// @route   GET /api/payments/key
const getRazorpayKey = async (req, res) => {
  res.json({ success: true, data: { key: process.env.RAZORPAY_KEY_ID } });
};

module.exports = { createOrder, verifyPayment, getRazorpayKey };
