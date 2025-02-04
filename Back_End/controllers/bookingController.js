const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// User books a vehicle
exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, userId, startDate, endDate, price } = req.body; // Now userId must be provided explicitly

    if (!vehicleId || !userId || !startDate || !endDate || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.isAvailable) {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    const booking = new Booking({
      vehicleId,
      userId,
      vendorId: vehicle.vendorId,
      startDate,
      endDate,
      price,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings for a user 
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params; // Pass userId as a URL parameter
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const bookings = await Booking.find({ userId }).populate("vehicleId", "name");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Vendor views bookings for their vehicles 
exports.getVendorBookings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) return res.status(400).json({ message: "Vendor ID is required" });

    const bookings = await Booking.find({ vendorId }).populate("vehicleId", "name");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//User cancels booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId, userId } = req.body; // Pass bookingId and userId in the request body
    if (!bookingId || !userId) return res.status(400).json({ message: "Booking ID and User ID are required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: User ID mismatch" });
    }

    booking.status = "Cancelled";
    booking.paymentStatus = "Refunded";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
