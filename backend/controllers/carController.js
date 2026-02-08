const Car = require('../models/Car');
const Booking = require('../models/Booking');

// @desc    Get all cars with filters
// @route   GET /api/cars
const getCars = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, fuelType, transmission, category, brand, seats, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const filter = { isAvailable: true };

    if (city) filter.city = city;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (seats) filter.seats = parseInt(seats);

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseInt(maxPrice);
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Car.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: { car } });
  } catch (error) {
    next(error);
  }
};

// @desc    Check car availability for dates
// @route   GET /api/cars/:id/availability
const checkAvailability = async (req, res, next) => {
  try {
    const { pickupDate, dropDate } = req.query;

    if (!pickupDate || !dropDate) {
      return res.status(400).json({ success: false, message: 'Pickup and drop dates are required' });
    }

    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.isAvailable) {
      return res.json({ success: true, data: { available: false, message: 'Car is not available' } });
    }

    const isOverlapping = await Booking.checkOverlap(car._id, pickupDate, dropDate);

    res.json({
      success: true,
      data: {
        available: !isOverlapping,
        message: isOverlapping ? 'Car is booked for the selected dates' : 'Car is available',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cities
// @route   GET /api/cars/cities/list
const getCities = async (req, res) => {
  const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kolkata'];
  res.json({ success: true, data: { cities } });
};

// @desc    Get all brands
// @route   GET /api/cars/brands/list
const getBrands = async (req, res) => {
  const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'MG', 'BMW', 'Mercedes-Benz', 'Audi'];
  res.json({ success: true, data: { brands } });
};

module.exports = { getCars, getCarById, checkAvailability, getCities, getBrands };
