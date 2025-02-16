const mongoose = require("mongoose");
const Bus = require("../models/Bus");

exports.createBus = async (req, res) => {
  try {
    const { vendorId, name, pricePerSeat, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBus = new Bus({
      vendorId,  // ensure vendorId is stored
      name,
      pricePerSeat,
      image,
      pickupPoint,
      dropPoint,
      totalSeats,
      tripDate,
      takeOffDate,
    });

    await newBus.save();
    res.status(201).json({ success: true, message: " Bus added successfully", bus: newBus });
  } catch (error) {
    console.error(" Error creating bus:", error);
    res.status(500).json({ success: false, message: " Failed to create bus", error: error.message });
  }
};


exports.getAllBuses = async (req, res) => {
  try {
    const { vendorId, admin, homepage } = req.query;
    let buses;

    if (admin === "true") {
      buses = await Bus.find();
    } else if (homepage === "true") {
      buses = await Bus.find({}, "pickupPoint dropPoint"); // ✅ Only pickup & drop locations
    } else if (vendorId) {
      buses = await Bus.find({ vendorId });
    } else {
      buses = await Bus.find(); // ✅ Return all buses if no filters applied
    }

    if (!buses || buses.length === 0) {
      return res.status(404).json({ message: "No buses found." });
    }

    res.status(200).json({ success: true, buses });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Failed to fetch buses", error: error.message });
  }
};







exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params; 

    //  Validate Bus ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: " Invalid Bus ID format" });
    }

    // Find Bus by ID
    const bus = await Bus.findById(id);
    
    if (!bus) {
      return res.status(404).json({ message: " Bus not found" });
    }

    // Return Bus Data
    res.status(200).json({ success: true, data: bus });
  } catch (error) {
    console.error(" Error fetching bus:", error);
    res.status(500).json({ message: " Failed to fetch bus", error: error.message });
  }
};




// Update a bus by ID (PUT)
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

// Delete a bus by ID (DELETE)
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
