const express = require("express");
const router = express.Router();

const {
  getUpcomingBookings,
  getBookingHistory,
  refundBooking,
  cancelBooking,
  getMyBookings,
  requestRefund,
  getRefundRequests,
  processRefundRequest,
} = require("../controllers/refundController");

const { protect, authorize } = require("../middleware/authMiddleware");

// USER 
router.get("/my-bookings/:userId", protect, authorize("user"), getMyBookings);

router.get("/upcoming/:userId", protect, authorize("user"), getUpcomingBookings);

router.get("/history/:userId", protect, authorize("user"), getBookingHistory);

router.put("/cancel/:bookingId", protect, authorize("user"), cancelBooking);

router.post("/request/:bookingId", protect, authorize("user"), requestRefund);
//ADMIN ROUTES

router.get("/admin/refund-requests", protect, authorize("admin"), getRefundRequests);

router.put("/admin/refund-requests/:id", protect, authorize("admin"), processRefundRequest);


//DIRECT REFUND BY ADMIN (OPTIONAL)

router.post("/refund/:bookingId", protect, authorize("admin"), refundBooking);

module.exports = router;
