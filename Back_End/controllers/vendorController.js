const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");


// Controller to get vehicles for a specific vendor
exports.getVehicles = async (req, res) => {
    try {
      const { vendorId } = req.params;
      const vehicles = await Vehicle.find({ vendorId });  // Fetch vehicles based on vendorId
      
      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ message: "No vehicles found for this vendor." });
      }
      
      res.json({ vehicles });
    } catch (error) {
      res.status(500).json({ message: "Error fetching vehicles", error });
    }
  };

// Fetch bookings for a vendor
exports.getBookings = async (req, res) => {
    try {
      const { vendorId } = req.params;
      // Assuming you have a Booking model
      const bookings = await Booking.find({ vendorId });
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  };

// ✅ Get Vendor Stats
exports.getStats = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const totalVehicles = await Vehicle.countDocuments({ vendorId });
    const totalBookings = await Booking.countDocuments({ vendorId });
    const totalEarnings = await Booking.aggregate([
      { $match: { vendorId: vendorId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      vehicles: totalVehicles,
      bookings: totalBookings,
      earnings: totalEarnings[0]?.total || 0,
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats", error });
  }
};
