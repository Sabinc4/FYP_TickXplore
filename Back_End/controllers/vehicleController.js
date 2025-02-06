const Vehicle = require("../models/Vehicle");

// ✅ Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error });
  }
};

// ✅ Get a specific vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle", error });
  }
};

// ✅ Add a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added successfully!", vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ message: "Error adding vehicle", error });
  }
};

// ✅ Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ message: "Vehicle updated successfully!", vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle", error });
  }
};

// ✅ Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ message: "Vehicle deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle", error });
  }
};
