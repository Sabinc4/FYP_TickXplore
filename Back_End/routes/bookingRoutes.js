const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Reservation = require("../models/Reservation");

//Fetch all bookings for a user
router.get("/bookings/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ userId }).populate("busId vehicleId");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
});

router.get("/my-bookings", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const bookings = await Booking.find({ userId, status: "Booked" })
      .populate("busId")
      .populate("vehicleId")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    console.error("My Bookings Error:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


//Cancel a booking
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

router.post("/reservations", async (req, res) => {
  const { vehicleId, userId, reservedFrom, reservedUntil } = req.body;

  try {
    // Check for existing active reservation for this vehicle in the selected range
    const existingReservation = await Reservation.findOne({
      vehicleId,
      $or: [
        {
          reservedFrom: { $lte: reservedUntil },
          reservedUntil: { $gte: reservedFrom },
        },
      ],
    });

    if (existingReservation) {
      return res.status(409).json({ message: "Vehicle already reserved for selected date range." });
    }

    // If not reserved, create new reservation
    const reservation = new Reservation({
      vehicleId,
      userId,
      reservedFrom,
      reservedUntil,
      paymentStatus: "completed",
    });

    await reservation.save();
    res.status(201).json({ message: "Reservation successful", reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Server error while creating reservation" });
  }
});

router.get("/reservations/vehicle/:vehicleId", async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const reservations = await Reservation.find({ vehicleId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;