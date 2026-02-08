const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/key', getRazorpayKey);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
