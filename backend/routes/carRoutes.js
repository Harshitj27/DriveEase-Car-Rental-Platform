const express = require('express');
const router = express.Router();
const { getCars, getCarById, checkAvailability, getCities, getBrands } = require('../controllers/carController');

router.get('/cities/list', getCities);
router.get('/brands/list', getBrands);
router.get('/', getCars);
router.get('/:id', getCarById);
router.get('/:id/availability', checkAvailability);

module.exports = router;
