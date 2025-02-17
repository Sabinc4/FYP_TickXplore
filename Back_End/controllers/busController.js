const mongoose = require("mongoose");
const Bus = require("../models/Bus");

// ✅ Create a new Bus
exports.createBus = async (req, res) => {
  try {
    const { vendorId, name, pricePerSeat, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBus = new Bus({
      vendorId,
      name,
      pricePerSeat,
      image,
      pickupPoint,
      dropPoint,
      totalSeats,
      tripDate,
      takeOffDate,
      bookedSeats: [], // ✅ Ensure bookedSeats is initialized
    });

    await newBus.save();
    res.status(201).json({ success: true, message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ success: false, message: "Failed to create bus", error: error.message });
  }
};

// ✅ Get All Buses
exports.getAllBuses = async (req, res) => {
  try {
    const { vendorId, admin, homepage } = req.query;
    let buses;

    if (admin === "true") {
      buses = await Bus.find();
    } else if (homepage === "true") {
      buses = await Bus.find({}, "pickupPoint dropPoint");
    } else if (vendorId) {
      buses = await Bus.find({ vendorId });
    } else {
      buses = await Bus.find();
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

// ✅ Get Bus by ID
exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bus ID format" });
    }

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ success: true, data: bus });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({ message: "Failed to fetch bus", error: error.message });
  }
};

// ✅ Update a Bus by ID
exports.updateBus = async (req, res) => {
  try {
    const busData = req.body;

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

// ✅ Book Seats (Fixed)
exports.bookSeats = async (req, res) => {
  const { busId, seats } = req.body;
  try {
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Check for already booked seats
    const alreadyBooked = seats.some((seat) => bus.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({ message: "Some seats are already booked" });
    }

    bus.bookedSeats.push(...seats);
    await bus.save();

    res.json({ message: "Seats booked successfully", bookedSeats: bus.bookedSeats });
  } catch (error) {
    res.status(500).json({ message: "Error booking seats" });
  }
};

// ✅ Delete a Bus by ID
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
