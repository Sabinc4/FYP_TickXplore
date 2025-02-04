const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const multer = require("multer");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Add a New Vehicle
const addVehicle = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: "File upload error: " + err.message });

    try {
      const { name, type, pricePerDay, vendorId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ message: "Invalid Vendor ID format." });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Vehicle image is required." });
      }
      if (pricePerDay <= 0) {
        return res.status(400).json({ message: "Price per day must be greater than 0." });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const newVehicle = new Vehicle({ name, type, pricePerDay, image: imageUrl, vendorId });
      await newVehicle.save();

      res.status(201).json({ message: " Vehicle added successfully!", vehicle: newVehicle });
    } catch (error) {
      console.error(" Error adding vehicle:", error);
      res.status(500).json({ message: "Error adding vehicle", error: error.message });
    }
  });
};

// Get All Vehicles for a Vendor
const getVehicles = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid Vendor ID format." });
    }

    const vehicles = await Vehicle.find({ vendorId });
    res.status(200).json({ vehicles });
  } catch (error) {
    console.error(" Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles", error: error.message });
  }
};

// Get Bookings for a Vendor
const getBookings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid Vendor ID format." });
    }

    const bookings = await Booking.find({ vendorId })
      .populate("vehicleId", "name type pricePerDay")
      .populate("userId", "name email");

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(" Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

//Get Vendor Stats
const getVendorStats = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid Vendor ID format." });
    }

    const vehiclesCount = await Vehicle.countDocuments({ vendorId });
    const bookingsCount = await Booking.countDocuments({ vendorId });

    const totalEarnings = await Booking.aggregate([
      { $match: { vendorId: new mongoose.Types.ObjectId(vendorId), status: "Completed" } },
      { $group: { _id: null, total: { $sum: { $toDouble: "$price" } } } },
    ]);

    res.status(200).json({
      vehicles: vehiclesCount,
      bookings: bookingsCount,
      earnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
    });
  } catch (error) {
    console.error(" Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

//Export Functions Properly
module.exports = {
  addVehicle,
  getVehicles,
  getBookings,
  getVendorStats,
};
