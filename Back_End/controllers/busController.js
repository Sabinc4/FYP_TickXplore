const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Bus = require("../models/Bus");

// ✅ Create Bus
exports.createBus = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // ✅ Debugging log

    const { vendorId, name, pricePerSeat, pickupPoint, dropPoint, totalSeats, tripDate, takeOffDate } = req.body;

    if (!vendorId || !name || !pricePerSeat || !pickupPoint || !dropPoint || !totalSeats || !tripDate || !takeOffDate) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // ✅ Ensure bookedSeats is stored correctly
    let bookedSeats = [];
    if (req.body.bookedSeats) {
      bookedSeats = Array.isArray(req.body.bookedSeats) ? req.body.bookedSeats : JSON.parse(req.body.bookedSeats);
    }

    console.log("✅ Final bookedSeats:", bookedSeats); // 🛠️ Debugging log

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
      bookedSeats, 
    });

    await newBus.save();
    res.status(201).json({ success: true, message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ success: false, message: "Failed to create bus", error: error.message });
  }
};


// ✅ Get Price of a Specific Seat
exports.getSeatPrice = async (req, res) => {
  try {
    const { busId } = req.params;
    const { seat } = req.query;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const seatPrice = bus.seatPrices?.[seat];
    if (seatPrice === undefined) {
      return res.status(404).json({ success: false, message: "Seat price not found" });
    }

    res.json({ success: true, price: seatPrice });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch seat price", error: error.message });
  }
};


// ✅ Get All Buses
exports.getAllBuses = async (req, res) => {
  try {
    console.log("Query Params:", req.query); // ✅ Log query parameters for debugging

    const { vendorId, admin, homepage } = req.query;
    let buses;

    if (admin === "true") {
      buses = await Bus.find().populate("vendorId", "name email"); // ✅ Admin sees all buses with vendor details
    } else if (homepage === "true") {
      buses = await Bus.find({}, "pickupPoint dropPoint"); // ✅ Homepage only gets pickup & drop locations
    } else if (vendorId) {
      buses = await Bus.find({ vendorId }).populate("vendorId", "name email"); // ✅ Vendors see only their own buses
    } else {
      buses = await Bus.find().populate("vendorId", "name email"); // ✅ Default: show all buses with vendor details
    }

    if (!buses || buses.length === 0) {
      return res.status(404).json({ success: false, message: "No buses found." });
    }

    // ✅ Modify image paths to include the full server URL
    const busesWithFullImageUrl = buses.map(bus => ({
      ...bus.toObject(),
      image: bus.image ? `http://localhost:3001${bus.image}` : null
    }));

    res.status(200).json({ success: true, buses: busesWithFullImageUrl });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ success: false, message: "Failed to fetch buses", error: error.message });
  }
};


// ✅ Get Bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.status(200).json({ success: true, bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bus", error: error.message });
  }
};

// ✅ Update Bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // 🎯 Update only provided fields
    if (req.body.name) bus.name = req.body.name;
    if (req.body.pricePerSeat) bus.pricePerSeat = req.body.pricePerSeat;
    if (req.body.pickupPoint) bus.pickupPoint = req.body.pickupPoint;
    if (req.body.dropPoint) bus.dropPoint = req.body.dropPoint;
    if (req.body.totalSeats) bus.totalSeats = req.body.totalSeats;
    if (req.body.tripDate) bus.tripDate = new Date(req.body.tripDate);
    if (req.body.takeOffDate) bus.takeOffDate = new Date(req.body.takeOffDate);

    // ✅ Ensure bookedSeats is parsed correctly
    if (req.body.bookedSeats) {
      bus.bookedSeats = Array.isArray(req.body.bookedSeats) ? req.body.bookedSeats : JSON.parse(req.body.bookedSeats);
    }

    console.log("✅ Updated bookedSeats:", bus.bookedSeats); // 🛠️ Debugging log

    // ✅ Handle new image upload
    if (req.file) {
      bus.image = `/uploads/${req.file.filename}`;
    }

    await bus.save();
    res.status(200).json({ success: true, message: "Bus updated successfully", bus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bus", error: error.message });
  }
};



// ✅ Delete Bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    await bus.deleteOne();
    res.status(200).json({ success: true, message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete bus", error: error.message });
  }
};