const Vehicle = require("../models/Vehicle");
const multer = require("multer");
const path = require("path");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed."), false);
    } else {
      cb(null, true);
    }
  },
}).single("image");

// Create a Vehicle
exports.createVehicle = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(500).json({ success: false, message: "Server error: " + err.message });
    }

    try {
      console.log("Uploaded File:", req.file); // Debugging log

      const { name, pickupPoint, dropPoint, capacity, price, vendorId, takeOffDate } = req.body;

      // Validate required fields
      if (!name || !pickupPoint || !dropPoint || !capacity || !price || !vendorId) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      // Validate image upload
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required." });
      }

      // Save only the relative path
      const image = `/uploads/${req.file.filename}`;
      console.log("Image Path:", image); // Debugging log

      const vehicle = new Vehicle({
        name,
        image,
        pickupPoint,
        dropPoint,
        capacity,
        price,
        vendorId,
        takeOffDate: takeOffDate ? new Date(takeOffDate) : null,
      });

      await vehicle.save();
      res.status(201).json({ success: true, message: "Vehicle created successfully", vehicle });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create vehicle", error: error.message });
    }
  });
};


// Get All Vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const { vendorId, admin } = req.query;
    let query = {};

    if (admin === "true") {
      query = {}; // Admin sees all vehicles
    } else if (vendorId) {
      query = { vendorId }; // Vendor sees only their vehicles
    }

    // ✅ Populate vendor details (name, email)
    const vehicles = await Vehicle.find(query).populate("vendorId", "name email");

    // Add full image URL to each vehicle
    const vehiclesWithFullImageUrl = vehicles.map((vehicle) => ({
      ...vehicle.toObject(),
      image: vehicle.image ? `http://localhost:3001${vehicle.image}` : null,
    }));

    res.status(200).json({ success: true, vehicles: vehiclesWithFullImageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicles", error: error.message });
  }
};


// Get a Single Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("vendorId", "name email");
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // Add full image URL to the vehicle
    const vehicleWithFullImageUrl = {
      ...vehicle.toObject(),
      image: vehicle.image ? `http://localhost:3001${vehicle.image}` : null,
    };

    res.status(200).json({ success: true, vehicle: vehicleWithFullImageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicle", error: error.message });
  }
};

// Reserve a Vehicle with a Take-Off Date
exports.reserveVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { userId, takeOffDate } = req.body;

    if (!userId || !takeOffDate) {
      return res.status(400).json({ success: false, message: "User ID and Take-Off Date are required." });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({ success: false, message: "Vehicle is already reserved." });
    }

    // Reserve full vehicle
    vehicle.reservations.push({ userId, takeOffDate: new Date(takeOffDate), seats: "All" });
    vehicle.isAvailable = false; // Mark vehicle as unavailable

    await vehicle.save();
    res.status(200).json({ success: true, message: "Full vehicle reserved successfully.", vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reserve vehicle", error: error.message });
  }
};




// Cancel a Reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required to cancel a reservation." });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    // Find and remove reservation
    const reservationIndex = vehicle.reservations.findIndex((r) => r.userId.toString() === userId);
    if (reservationIndex === -1) {
      return res.status(400).json({ success: false, message: "No reservation found for this user." });
    }

    vehicle.reservations.splice(reservationIndex, 1);

    // Mark vehicle as available if not fully reserved
    if (vehicle.reservations.length < vehicle.capacity) {
      vehicle.isAvailable = true;
    }

    await vehicle.save();
    res.status(200).json({ success: true, message: "Reservation cancelled successfully.", vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel reservation", error: error.message });
  }
};

// Delete a Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    await vehicle.deleteOne();
    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete vehicle", error: error.message });
  }
};

// Mark Departed Vehicles (Cron Job)
exports.markDepartedVehicles = async () => {
  try {
    const now = new Date();
    const vehicles = await Vehicle.find({
      "reservations.takeOffDate": { $lte: now },
      isAvailable: true,
    });

    for (const vehicle of vehicles) {
      vehicle.isAvailable = false;
      await vehicle.save();
    }

    console.log(`Updated ${vehicles.length} vehicles as departed.`);
  } catch (error) {
    console.error("Error marking vehicles as departed:", error);
  }
};

// Run Cron Job Every Minute
setInterval(exports.markDepartedVehicles, 60 * 1000);