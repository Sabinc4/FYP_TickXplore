const multer = require("multer");
const path = require("path");
const Vehicle = require("../models/Vehicle");

//for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads/", 
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("image");

//Create a Vehicle
exports.createVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "File upload error." });

    try {
      const { name, type, pricePerDay, vendorId, registrationNumber } = req.body;
      if (!name || !type || !pricePerDay || !vendorId) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

      const vehicle = new Vehicle({
        name,
        type,
        pricePerDay,
        image: imagePath,
        registrationNumber,
        vendorId,
      });

      await vehicle.save();
      res.status(201).json({ message: " Vehicle added successfully!", vehicle });
    } catch (error) {
      console.error(" Vehicle Add Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

//Get All Available Vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isAvailable: true }).populate("vendorId", "name");
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("vendorId", "name");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Vehicle
exports.updateVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "File upload error." });

    try {
      const { vendorId, name, type, pricePerDay, registrationNumber } = req.body;
      if (!vendorId) return res.status(400).json({ message: "Vendor ID is required." });

      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

      if (vehicle.vendorId.toString() !== vendorId) {
        return res.status(403).json({ message: "Unauthorized: Vendor ID mismatch." });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : vehicle.image;

      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { name, type, pricePerDay, image: imagePath, registrationNumber },
        { new: true }
      );

      res.status(200).json({ message: " Vehicle updated successfully!", updatedVehicle });
    } catch (error) {
      console.error(" Vehicle Update Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

//Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId) return res.status(400).json({ message: "Vendor ID is required." });

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

    if (vehicle.vendorId.toString() !== vendorId) {
      return res.status(403).json({ message: "Unauthorized: Vendor ID mismatch." });
    }

    await vehicle.deleteOne();
    res.status(200).json({ message: "Vehicle deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
