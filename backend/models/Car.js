const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      enum: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'MG', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      enum: ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kolkata'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [500, 'Price must be at least ₹500'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: ['Manual', 'Automatic'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: 2,
      max: 8,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
      },
    ],
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    features: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    mileage: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({ city: 1, isAvailable: 1 });
carSchema.index({ brand: 1 });
carSchema.index({ category: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ fuelType: 1, transmission: 1 });
carSchema.index({ city: 1, pricePerDay: 1, fuelType: 1, transmission: 1 });

module.exports = mongoose.model('Car', carSchema);
