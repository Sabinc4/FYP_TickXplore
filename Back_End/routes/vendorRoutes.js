const express = require("express");
const vendorController = require("../controllers/vendorController");
const router = express.Router();

router.post("/add-vehicle", vendorController.addVehicle);
router.get("/get-vehicles/:vendorId", vendorController.getVehicles);
router.get("/get-bookings/:vendorId", vendorController.getBookings);
router.get("/get-stats/:vendorId", vendorController.getVendorStats);

module.exports = router;
