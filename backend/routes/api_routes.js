const express = require('express');
const router = express.Router();
const cocomoController = require('../controllers/cocomo_controller.js');  // Thêm .js vào cuối

// Basic COCOMO II calculation (backwards compatible)
router.post('/predict', cocomoController.calculateBasic);

// Detailed COCOMO II calculation with all drivers
router.post('/cocomo/detailed', cocomoController.calculateDetailed);

// Get all available COCOMO II drivers and their values
router.get('/cocomo/drivers', cocomoController.getDrivers);

module.exports = router;