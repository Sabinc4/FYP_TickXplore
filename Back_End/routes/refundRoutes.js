// routes/refundRoutes.js
const express = require("express");
const router = express.Router();
const {
  refundBooking,
  getUpcomingBookings,
  cancelBooking,
} = require("../controllers/refundController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Routes
router.get("/upcoming/:userId", protect, authorize("user"), getUpcomingBookings);
router.post("/refund/:bookingId", protect, authorize("user"), refundBooking);
router.put("/cancel/:bookingId", protect, authorize("user"), cancelBooking); // ✅ correct place

module.exports = router;
