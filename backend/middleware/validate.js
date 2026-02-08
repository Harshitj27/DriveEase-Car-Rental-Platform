const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),
  body('phoneNumber')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const bookingValidation = [
  body('carId').notEmpty().withMessage('Car ID is required').isMongoId().withMessage('Invalid car ID'),
  body('pickupDate').notEmpty().withMessage('Pickup date is required').isISO8601().withMessage('Invalid pickup date'),
  body('dropDate').notEmpty().withMessage('Drop date is required').isISO8601().withMessage('Invalid drop date'),
  handleValidationErrors,
];

const carValidation = [
  body('name').trim().notEmpty().withMessage('Car name is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('pricePerDay').isNumeric().withMessage('Price must be a number').isFloat({ min: 500 }).withMessage('Price must be at least ₹500'),
  body('fuelType').notEmpty().withMessage('Fuel type is required'),
  body('transmission').notEmpty().withMessage('Transmission is required'),
  body('seats').isInt({ min: 2, max: 8 }).withMessage('Seats must be between 2 and 8'),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  bookingValidation,
  carValidation,
  handleValidationErrors,
};
