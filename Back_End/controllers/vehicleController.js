const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const path = require("path");
const fs = require("fs");

//Validate Required Fields
const validateRequiredFields = (fields, res) => {
  const missingFields = Object.keys(fields).filter((key) => !fields[key]);
  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
    return false;
  }
  return true;
};

//Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { vendorId, name, price, capacity, takeOffDate } = req.body;

    if (!validateRequiredFields({ vendorId, name, price, capacity, takeOffDate }, res)) return;

    // Convert vendorId
    let objectIdVendorId;
    try {
      objectIdVendorId = new mongoose.Types.ObjectId(vendorId);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid vendor ID format." });
    }

    // Handle Image Upload
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    const file = req.files.image;
    const fileName = file.name;
    const uploadPath = path.join("uploads", fileName);
    const absolutePath = path.join(__dirname, "..", uploadPath);

    // If image doesn't exist, then save it. Otherwise, reuse the existing image.
    if (!fs.existsSync(absolutePath)) {
      await file.mv(absolutePath);
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    const newVehicle = new Vehicle({
      vendorId: objectIdVendorId,
      name,
      price: Number(price),
      capacity: Number(capacity),
      takeOffDate,
      image: imageUrl,
      isAvailable: true,
      reservations: [],
    });

    await newVehicle.save();
    res.status(201).json({ success: true, message: "Vehicle added successfully.", vehicle: newVehicle });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ success: false, message: "Failed to create vehicle.", error: error.message });
  }
};


//Get All Vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const { vendorId, admin } = req.query;
    const query = admin === "true" ? {} : vendorId ? { vendorId } : {};
    const vehicles = await Vehicle.find(query).populate("vendorId", "name email");

    if (!vehicles.length) {
      return res.status(404).json({ success: false, message: "No vehicles found." });
    }

    res.status(200).json({
      success: true,
      vehicles: vehicles.map(vehicle => ({
        ...vehicle.toObject(),
        image: vehicle.image || null,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicles.", error: error.message });
  }
};

//Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("vendorId", "name email");
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }
    res.status(200).json({
      success: true,
      vehicle: {
        ...vehicle.toObject(),
        image: vehicle.image || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicle.", error: error.message });
  }
};

//Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, name, price, capacity, takeOffDate, isAvailable } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    // Convert vendorId if present
    let objectIdVendorId;
    if (vendorId) {
      try {
        objectIdVendorId = new mongoose.Types.ObjectId(vendorId);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid vendor ID format." });
      }
    }

    // Handle image update
    if (req.files?.image) {
      const file = req.files.image;
      const fileName = `${vendorId || vehicle.vendorId}_${file.name}`;
      const uploadPath = path.join("uploads", fileName);
      const absolutePath = path.join(__dirname, "..", uploadPath);

      // Delete old image if exists
      if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);

      await file.mv(absolutePath);
      vehicle.image = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    }

    // Update fields
    if (vendorId) vehicle.vendorId = objectIdVendorId;
    if (name) vehicle.name = name;
    if (price) vehicle.price = Number(price);
    if (capacity) vehicle.capacity = Number(capacity);
    if (takeOffDate) vehicle.takeOffDate = takeOffDate;
    if (isAvailable !== undefined) vehicle.isAvailable = isAvailable;

    await vehicle.save();
    res.status(200).json({ success: true, message: "Vehicle updated successfully.", vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update vehicle.", error: error.message });
  }
};

//Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });

    if (vehicle.image) {
      const filePath = path.join(__dirname, "..", vehicle.image.replace(`${req.protocol}://${req.get("host")}/`, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await vehicle.deleteOne();
    res.status(200).json({ success: true, message: "Vehicle deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete vehicle.", error: error.message });
  }
};

// Reserve Vehicle
exports.reserveVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reservedFrom, reservedUntil, pickupPoint, dropPoint } = req.body;

    if (!validateRequiredFields({ userId, reservedFrom, reservedUntil, pickupPoint, dropPoint }, res)) return;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });

    const isAvailable = vehicle.reservations.every(reservation =>
      new Date(reservedUntil) < new Date(reservation.reservedFrom) ||
      new Date(reservedFrom) > new Date(reservation.reservedUntil)
    );

    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Vehicle is not available for the requested dates." });
    }

    vehicle.reservations.push({ userId, reservedFrom, reservedUntil, pickupPoint, dropPoint });
    await vehicle.save();

    res.status(201).json({ success: true, message: "Reservation successful.", vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reserve vehicle.", error: error.message });
  }
};
