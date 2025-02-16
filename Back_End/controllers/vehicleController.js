const mongoose = require("mongoose");
const VehicleModel = require("../models/Vehicle");

// Create a New Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { vendorId, name, type, pricePerSeat, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newVehicle = new VehicleModel({
      vendorId,  // Ensure vendorId is stored
      name,
      type,
      pricePerSeat,
      image,
      pickupPoint,
      dropPoint,
      totalSeats,
      bookedSeats: [],
      tripDate,
      takeOffDate,
    });

    await newVehicle.save();
    res.status(201).json({ success: true, message: " Vehicle added successfully", vehicle: newVehicle });
  } catch (error) {
    console.error(" Error creating vehicle:", error);
    res.status(500).json({ success: false, message: " Failed to create vehicle", error: error.message });
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const { vendorId, admin, homepage } = req.query;

    let vehicles;

    if (admin === "true") {
      vehicles = await VehicleModel.find(); // ✅ Return all vehicles for admin
    } else if (homepage === "true") {
      vehicles = await VehicleModel.find({}, "pickupPoint dropPoint"); // ✅ Only pickup & drop locations
    } else if (vendorId) {
      vehicles = await VehicleModel.find({ vendorId }); // ✅ Fetch vendor-specific vehicles
    } else {
      vehicles = await VehicleModel.find(); // ✅ Return all vehicles if no filters applied
    }

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found." });
    }

    res.status(200).json({ success: true, vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Failed to fetch vehicles", error: error.message });
  }
};





// Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Vehicle ID format" });
    }

    const vehicle = await VehicleModel.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: " Vehicle not found" });

    res.status(200).json({ vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: " Failed to fetch vehicle", error: error.message });
  }
};

//  Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: " Invalid Vehicle ID format" });
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

    if (!updatedVehicle) return res.status(404).json({ message: " Vehicle not found" });

    res.status(200).json({ message: " Vehicle updated successfully", vehicle: updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: " Failed to update vehicle", error: error.message });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Vehicle ID format" });
    }

    const deletedVehicle = await VehicleModel.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: " Vehicle not found" });

    res.status(200).json({ message: " Vehicle deleted successfully" });
  } catch (error) {
    console.error(" Error deleting vehicle:", error);
    res.status(500).json({ message: " Failed to delete vehicle", error: error.message });
  }
};
