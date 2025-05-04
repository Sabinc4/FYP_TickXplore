const express = require("express");
const router = express.Router();
const {
  getUpcomingBookings,
  getBookingHistory,
  refundBooking,
  cancelBooking,
  getMyBookings, // ✅ Import this controller
} = require("../controllers/refundController"); // (assuming refundController has it)
const { protect, authorize } = require("../middleware/authMiddleware");

// New route for Track button
router.get("/my-bookings/:userId", protect, authorize("user"), getMyBookings);

router.get("/upcoming/:userId", protect, authorize("user"), getUpcomingBookings);
router.get("/history/:userId", protect, authorize("user"), getBookingHistory);
router.post("/refund/:bookingId", protect, authorize("user"), refundBooking);
router.put("/cancel/:bookingId", protect, authorize("user"), cancelBooking);

module.exports = router;