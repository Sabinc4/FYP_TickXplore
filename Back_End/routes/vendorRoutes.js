const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

// GET vehicles by vendor ID
router.get("/get-vehicles/:vendorId", vendorController.getVehicles);

// GET bookings for the vendor
router.get("/get-bookings/:vendorId", vendorController.getBookings);  // Add this in controller

// GET stats for the vendor
router.get("/get-stats/:vendorId", vendorController.getStats);  // Add this in controller

module.exports = router;
