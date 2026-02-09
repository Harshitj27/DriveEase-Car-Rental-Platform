const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { sendBookingConfirmation, sendBookingCancellation } = require('../services/emailService');

// ───── DASHBOARD ─────

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCars, totalBookings, revenueResult, recentBookings, bookingsByStatus, mostRentedCar] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Car.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Booking.find()
        .populate('user', 'name email')
        .populate('car', 'name brand')
        .sort('-createdAt')
        .limit(5),
      Booking.aggregate([
        { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { bookingStatus: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: '$car', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'cars',
            localField: '_id',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        { $unwind: '$carDetails' },
      ]),
    ]);

    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCars,
        totalBookings,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        recentBookings,
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        mostRentedCar: mostRentedCar[0] || null,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ───── CAR MANAGEMENT ─────

// @desc    Add a new car (admin)
// @route   POST /api/admin/cars
const addCar = async (req, res, next) => {
  try {
    const { name, brand, category, city, pricePerDay, fuelType, transmission, seats, description, features, mileage, year, rating } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({ url: file.path, publicId: file.filename });
      }
    }

    const car = await Car.create({
      name,
      brand,
      category,
      city,
      pricePerDay,
      fuelType,
      transmission,
      seats,
      images,
      description: description || '',
      features: features
        ? typeof features === 'string'
          ? (() => { try { return JSON.parse(features); } catch { return features.split(',').map((f) => f.trim()).filter(Boolean); } })()
          : features
        : [],
      mileage: mileage || '',
      year: year || new Date().getFullYear(),
      rating: rating || 4.0,
    });

    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car (admin)
// @route   PUT /api/admin/cars/:id
const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const updates = { ...req.body };
    if (updates.features && typeof updates.features === 'string') {
      try {
        updates.features = JSON.parse(updates.features);
      } catch {
        updates.features = updates.features.split(',').map((f) => f.trim()).filter(Boolean);
      }
    }

    // Handle existing images sent from frontend (user may have removed some)
    let keptImages = car.images;
    if (updates.existingImages) {
      try {
        keptImages = JSON.parse(updates.existingImages);
      } catch {
        keptImages = car.images;
      }
      delete updates.existingImages;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
      updates.images = [...keptImages, ...newImages];
    } else {
      updates.images = keptImages;
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: { car: updatedCar },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car (admin)
// @route   DELETE /api/admin/cars/:id
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Check for active bookings FIRST before deleting anything
    const activeBookings = await Booking.countDocuments({
      car: car._id,
      bookingStatus: { $in: ['pending', 'confirmed'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete car with ${activeBookings} active booking(s). Cancel them first.`,
      });
    }

    // Delete images from Cloudinary (safe now — no active bookings)
    for (const image of car.images) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err.message);
        }
      }
    }

    await Car.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cars (admin - includes unavailable)
// @route   GET /api/admin/cars
const getAllCarsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, city, brand } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (brand) filter.brand = brand;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cars, total] = await Promise.all([
      Car.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Car.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        cars,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove car image
// @route   DELETE /api/admin/cars/:id/image
const removeCarImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err.message);
      }
    }

    car.images = car.images.filter((img) => img.publicId !== publicId);
    await car.save();

    res.json({ success: true, message: 'Image removed', data: { car } });
  } catch (error) {
    next(error);
  }
};

// ───── BOOKING MANAGEMENT ─────

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.bookingStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email phoneNumber')
        .populate('car', 'name brand images city pricePerDay')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'completed', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('car', 'name brand images city')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus === status) {
      return res.status(400).json({ success: false, message: `Booking is already ${status}` });
    }

    booking.bookingStatus = status;

    if (status === 'cancelled' || status === 'rejected') {
      booking.cancelledAt = new Date();
      if (booking.paymentStatus === 'paid') {
        booking.paymentStatus = 'refunded';
      }
      sendBookingCancellation(booking, booking.user, booking.car);
    }

    if (status === 'confirmed' && booking.paymentStatus === 'paid') {
      sendBookingConfirmation(booking, booking.user, booking.car);
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// ───── USER MANAGEMENT ─────

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'user' };

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user block status (admin)
// @route   PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an admin' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'User blocked' : 'User unblocked',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
