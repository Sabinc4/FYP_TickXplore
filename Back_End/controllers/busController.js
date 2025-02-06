const Bus = require("../models/Bus");

// ✅ Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({ success: true, buses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching buses", error });
  }
};

// ✅ Get a specific bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ success: true, bus });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus", error });
  }
};

// ✅ Add a new bus
exports.addBus = async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    await newBus.save();
    res.status(201).json({ message: "Bus added successfully!", bus: newBus });
  } catch (error) {
    res.status(500).json({ message: "Error adding bus", error });
  }
};

// ✅ Update a bus
exports.updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ message: "Bus updated successfully!", bus: updatedBus });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus", error });
  }
};

// ✅ Delete a bus
exports.deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({ message: "Bus deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bus", error });
  }
};
