const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car is required'],
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    dropDate: {
      type: Date,
      required: [true, 'Drop date is required'],
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    pickupCity: {
      type: String,
      required: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ car: 1, pickupDate: 1, dropDate: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

bookingSchema.statics.checkOverlap = async function (carId, pickupDate, dropDate, excludeBookingId) {
  const query = {
    car: carId,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        pickupDate: { $lte: new Date(dropDate) },
        dropDate: { $gte: new Date(pickupDate) },
      },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlapping = await this.findOne(query);
  return !!overlapping;
};

module.exports = mongoose.model('Booking', bookingSchema);
