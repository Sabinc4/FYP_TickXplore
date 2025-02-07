const mongoose = require("mongoose");
const VehicleModel = require("../models/Vehicle");

// ✅ Create a New Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { name, type, pricePerSeat, vendorId, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;
    
    // Image Handling
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newVehicle = new VehicleModel({
      name,
      type,
      pricePerSeat,
      image,
      vendorId,
      pickupPoint,
      dropPoint,
      totalSeats,
      bookedSeats: [], // Initially, no seats are booked
      tripDate,
      takeOffDate,
    });

    await newVehicle.save();
    res.status(201).json({ message: "✅ Vehicle added successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("❌ Error creating vehicle:", error);
    res.status(500).json({ message: "❌ Failed to create vehicle", error: error.message });
  }
};

// ✅ Get All Vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();
    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
    res.status(500).json({ message: "❌ Failed to fetch vehicles", error: error.message });
  }
};

// ✅ Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vehicle ID format" });
    }

    const vehicle = await VehicleModel.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "⚠️ Vehicle not found" });

    res.status(200).json({ vehicle });
  } catch (error) {
    console.error("❌ Error fetching vehicle:", error);
    res.status(500).json({ message: "❌ Failed to fetch vehicle", error: error.message });
  }
};

// ✅ Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vehicle ID format" });
    }

    const { name, type, pricePerSeat, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;
    
    // Image Handling
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      req.params.id,
      { 
        name,
        type,
        pricePerSeat,
        image,
        pickupPoint,
        dropPoint,
        totalSeats,
        tripDate,
        takeOffDate
      },
      { new: true }
    );

    if (!updatedVehicle) return res.status(404).json({ message: "⚠️ Vehicle not found" });

    res.status(200).json({ message: "✅ Vehicle updated successfully", vehicle: updatedVehicle });
  } catch (error) {
    console.error("❌ Error updating vehicle:", error);
    res.status(500).json({ message: "❌ Failed to update vehicle", error: error.message });
  }
};

// ✅ Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vehicle ID format" });
    }

    const deletedVehicle = await VehicleModel.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: "⚠️ Vehicle not found" });

    res.status(200).json({ message: "✅ Vehicle deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting vehicle:", error);
    res.status(500).json({ message: "❌ Failed to delete vehicle", error: error.message });
  }
};
