const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const path = require("path");
const fs = require("fs");

// 🔹 Helper function to validate required fields
const validateRequiredFields = (fields, res) => {
  const missingFields = Object.keys(fields).filter((key) => !fields[key]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
  return null;
};

// 🔹 Helper function to handle file upload
const handleFileUpload = (file, res) => {
  if (!file) return null;

  const uploadPath = path.join(__dirname, "..", "uploads", file.name);
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error("❌ File Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }
  });

  return `/uploads/${file.name}`;
};

exports.createVehicle = async (req, res) => {
  try {
    console.log("✅ Received Data:", req.body);
    console.log("✅ Received Files:", req.files);

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const { vendorId, name, price, pickupPoint, dropPoint, capacity, takeOffDate } = req.body;

    // Validate required fields
    if (!vendorId || !name || !price || !pickupPoint || !dropPoint || !capacity || !takeOffDate) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // ✅ Convert vendorId properly
    let objectIdVendorId;
    try {
      objectIdVendorId = new mongoose.Types.ObjectId(vendorId);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid vendorId format." });
    }

    // Convert price and capacity to numbers
    const priceNumber = Number(price);
    const capacityNumber = Number(capacity);
    if (isNaN(priceNumber) || isNaN(capacityNumber)) {
      return res.status(400).json({ success: false, message: "Invalid price or capacity value" });
    }

    // Handle Image Upload
    const file = req.files.image;
    const uploadPath = `uploads/${Date.now()}_${file.name}`;
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("❌ File Upload Error:", err);
        return res.status(500).json({ success: false, message: "File upload failed", error: err.message });
      }
    });

    // ✅ Create new vehicle with correct vendorId format
    const newVehicle = new Vehicle({
      vendorId: objectIdVendorId, // ✅ Use converted ObjectId
      name,
      price: priceNumber,
      capacity: capacityNumber,
      image: `http://localhost:3001/${uploadPath}`,
      pickupPoint,
      dropPoint,
      takeOffDate,
      isAvailable: true,
      reservations: [],
    });

    await newVehicle.save();
    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: newVehicle,
    });
  } catch (error) {
    console.error("❌ Error creating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message,
    });
  }
};

// ✅ Get All Vehicles
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

    if (!vehicles.length) {
      return res.status(404).json({ success: false, message: "No vehicles found." });
    }

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

// ✅ Get a Single Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("vendorId", "name email");

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // Ensure the image path is absolute (with backend URL)
    const vehicleWithFullImageUrl = {
      ...vehicle.toObject(),
      image: vehicle.image ? `http://localhost:3001${vehicle.image}` : null, // ✅ Ensure full image path
    };

    res.status(200).json({ success: true, vehicle: vehicleWithFullImageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicle", error: error.message });
  }
};


// ✅ Update a Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    console.log("✅ Updating Vehicle:", req.body);
    console.log("✅ Received Files:", req.files);

    const { id } = req.params; // Vehicle ID from URL
    const { vendorId, name, price, pickupPoint, dropPoint, capacity, takeOffDate, isAvailable } = req.body;

    // ✅ Find the Vehicle
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // ✅ Convert vendorId properly
    let objectIdVendorId;
    if (vendorId) {
      try {
        objectIdVendorId = new mongoose.Types.ObjectId(vendorId);
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid vendorId format." });
      }
    }

    // ✅ Convert price and capacity to numbers if provided
    const priceNumber = price ? Number(price) : vehicle.price;
    const capacityNumber = capacity ? Number(capacity) : vehicle.capacity;
    if ((price && isNaN(priceNumber)) || (capacity && isNaN(capacityNumber))) {
      return res.status(400).json({ success: false, message: "Invalid price or capacity value" });
    }

    // ✅ Handle Image Update
    let updatedImage = vehicle.image; // Keep old image if no new image is provided
    if (req.files?.image) {
      // Delete old image file
      if (vehicle.image) {
        const oldImagePath = path.join(__dirname, "..", vehicle.image.replace("http://localhost:3001/", ""));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Upload new image
      const file = req.files.image;
      const uploadPath = `uploads/${Date.now()}_${file.name}`;
      file.mv(uploadPath, (err) => {
        if (err) {
          console.error("❌ File Upload Error:", err);
          return res.status(500).json({ success: false, message: "File upload failed", error: err.message });
        }
      });

      updatedImage = `http://localhost:3001/${uploadPath}`; // Save new image URL
    }

    // ✅ Update Vehicle Data
    vehicle.name = name || vehicle.name;
    vehicle.price = priceNumber;
    vehicle.capacity = capacityNumber;
    vehicle.pickupPoint = pickupPoint || vehicle.pickupPoint;
    vehicle.dropPoint = dropPoint || vehicle.dropPoint;
    vehicle.takeOffDate = takeOffDate || vehicle.takeOffDate;
    vehicle.isAvailable = isAvailable !== undefined ? isAvailable : vehicle.isAvailable;
    vehicle.image = updatedImage;
    if (vendorId) vehicle.vendorId = objectIdVendorId; // Update vendorId if provided

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("❌ Error updating vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to update vehicle", error: error.message });
  }
};

// ✅ Delete a Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // Delete Image File if Exists
    if (vehicle.image) {
      const filePath = path.join(__dirname, "..", vehicle.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await vehicle.deleteOne();
    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to delete vehicle", error: error.message });
  }
};

// ✅ Export All Functions
module.exports = exports;
