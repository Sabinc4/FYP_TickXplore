const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Vehicle = require("../models/Vehicle");

// ✅ New route: Get Reservations for a Vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Find all vehicles owned by this vendor
    const vehicles = await Vehicle.find({ vendorId }).select("_id");

    const vehicleIds = vehicles.map(vehicle => vehicle._id);

    // Find reservations for those vehicles
    const reservations = await Reservation.find({ vehicleId: { $in: vehicleIds } });

    res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reservations", error: error.message });
  }
});

module.exports = router;