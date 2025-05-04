const express = require("express");
const router = express.Router();
const {
  getUserBookings,
  getMyBookings,
  deleteBooking,
  createReservation,
  getReservationsByVehicle,
  cancelBookingStatus,
  getBookingsByVendor,
} = require("../controllers/bookingController");

router.get("/user/:userId", getUserBookings);
router.get("/my-bookings", getMyBookings);
router.delete("/:bookingId", deleteBooking);
router.put("/cancel/:id", cancelBookingStatus);
router.post("/reservations", createReservation);
router.get("/reservations/vehicle/:vehicleId", getReservationsByVehicle);
router.get("/", getBookingsByVendor);

module.exports = router;
