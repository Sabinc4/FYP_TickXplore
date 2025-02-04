const express = require("express");
const {
  createBooking,
  getUserBookings,
  getVendorBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking); 
router.get("/user/:userId", getUserBookings); 
router.get("/vendor/:vendorId", getVendorBookings); 
router.put("/cancel", cancelBooking);

module.exports = router;
