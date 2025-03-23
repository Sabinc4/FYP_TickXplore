const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ Fetch all bookings for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch bookings and populate the busId field
    const bookings = await Booking.find({ userId }).populate("busId");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

// ✅ Cancel a booking
router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;

    // Fetch bookings for the vehicle
    const bookings = await Booking.find({ vehicleId });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings for vehicle:", err);
    res.status(500).json({ message: "Failed to fetch bookings for vehicle." });
  }
});

module.exports = router;
