const mongoose = require("mongoose");
const Bus = require("../models/Bus");

// ✅ Create a new bus (POST)
exports.createBus = async (req, res) => {
  try {
    const busData = req.body;

    // Convert JSON string fields to actual arrays/objects if necessary
    if (busData.bookedSeats) {
      busData.bookedSeats = JSON.parse(busData.bookedSeats);
    }

    // Handle image upload
    if (req.file) {
      busData.image = `/uploads/${req.file.filename}`;
    }

    const bus = new Bus(busData);
    await bus.save();
    res.status(201).json({ success: true, data: bus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all buses (GET)
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("vendorId", "name");
    res.status(200).json({ success: true, data: buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params; // Get Bus ID from params

    // ✅ Validate Bus ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid Bus ID format" });
    }

    // ✅ Find Bus by ID
    const bus = await Bus.findById(id);
    
    if (!bus) {
      return res.status(404).json({ message: "⚠️ Bus not found" });
    }

    // ✅ Return Bus Data
    res.status(200).json({ success: true, data: bus });
  } catch (error) {
    console.error("❌ Error fetching bus:", error);
    res.status(500).json({ message: "❌ Failed to fetch bus", error: error.message });
  }
};




// ✅ Update a bus by ID (PUT)
exports.updateBus = async (req, res) => {
  try {
    const busData = req.body;

    // Handle image upload
    if (req.file) {
      busData.image = `/uploads/${req.file.filename}`;
    }

    const bus = await Bus.findByIdAndUpdate(req.params.id, busData, { new: true, runValidators: true });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, data: bus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a bus by ID (DELETE)
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
