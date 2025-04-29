const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Bus = require("../models/Bus");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/sendEmail");

// Helper function to validate required fields
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

// Helper function to handle file upload
const handleFileUpload = (file, res) => {
  if (!file) return null;

  const imagePath = `/uploads/${file.name}`;
  file.mv(`.${imagePath}`, (err) => {
    if (err) {
      console.error("File Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: err,
      });
    }
  });
  return imagePath;
};

//Create Bus 
exports.createBus = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Received Files:", req.files); // Debugging

    const {
      vendorId,
      name,
      pricePerSeat,
      pickupPoint,
      dropPoint,
      totalSeats,
      tripDate,
      takeOffDate,
    } = req.body;

    // Validate required fields
    const validationError = validateRequiredFields(
      {
        vendorId,
        name,
        pricePerSeat,
        pickupPoint,
        dropPoint,
        totalSeats,
        tripDate,
        takeOffDate,
      },
      res
    );
    if (validationError) return validationError;

    // Ensure pricePerSeat is a number
    const pricePerSeatNumber = Number(pricePerSeat);
    if (isNaN(pricePerSeatNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricePerSeat value",
      });
    }
    console.log("Price Per Seat:", pricePerSeatNumber);

    // Ensure bookedSeats is an array
    let bookedSeats = [];
    if (req.body.bookedSeats) {
      try {
        bookedSeats = Array.isArray(req.body.bookedSeats)
          ? req.body.bookedSeats
          : JSON.parse(req.body.bookedSeats);
      } catch (error) {
        console.error("Error parsing bookedSeats:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid bookedSeats format",
        });
      }
    }
    console.log("Final bookedSeats:", bookedSeats);

    // Handle Image Upload
    const imagePath = handleFileUpload(req.files?.image, res);
    if (imagePath === null) return; // Stop execution if file upload fails

    // Create and save the new bus
    const newBus = new Bus({
      vendorId,
      name,
      pricePerSeat: pricePerSeatNumber,
      image: imagePath,
      pickupPoint,
      dropPoint,
      totalSeats,
      tripDate,
      takeOffDate,
      bookedSeats,
    });

    await newBus.save();

    // Now send notifications to users that a new bus has been added
    const users = await User.find({ isVerified: true });  // All verified users
    for (let user of users) {
      await Notification.create({
        userId: user._id,
        role: "user",
        message: `A new bus "${newBus.name}" is now available for booking from ${pickupPoint} to ${dropPoint}. Check it out!`,
      });
    }

    console.log("Notifications sent to users for new bus creation.");

    // Send an email to users (Optional)
    const userEmails = users.map(user => user.email);
    if (userEmails.length > 0) {
      await sendEmail(
        userEmails,
        "New Bus Added to TickXplore",
        `
        <p>Hello,</p>
        <p>We're excited to announce that a new bus "${newBus.name}" is now available for booking from ${pickupPoint} to ${dropPoint}!</p>
        <p>Check it out now on TickXplore!</p>
        <hr />
        <p>Thank you for being a part of TickXplore!</p>
        `
      );
    }

    res.status(201).json({
      success: true,
      message: "Bus added successfully and notifications sent.",
      bus: newBus,
    });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create bus",
      error: error.message,
    });
  }
};


// Get All Buses
exports.getAllBuses = async (req, res) => {
  try {
    console.log("Query Params:", req.query);

    const { vendorId, admin, homepage } = req.query;
    let buses;

    if (admin === "true") {
      buses = await Bus.find().populate("vendorId", "name email");
    } else if (homepage === "true") {
      buses = await Bus.find({}, "pickupPoint dropPoint");
    } else if (vendorId) {
      buses = await Bus.find({ vendorId }).populate("vendorId", "name email");
    } else {
      buses = await Bus.find().populate("vendorId", "name email");
    }

    // ✅ Return 200 with empty array instead of 404
    if (!buses.length) {
      return res.status(200).json({
        success: true,
        buses: [],
        message: "No buses found for this vendor.",
      });
    }

    const busesWithImages = buses.map((bus) => ({
      ...bus.toObject(),
      image: bus.image ? `http://localhost:3001${bus.image}` : null,
    }));

    res.status(200).json({ success: true, buses: busesWithImages });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
};


//Get Bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }
    res.status(200).json({ success: true, bus });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bus",
      error: error.message,
    });
  }
};

//Update Bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    console.log("Updating Bus:", req.body);

    // Update standard fields
    Object.keys(req.body).forEach((key) => {
      if (
        key !== "pricePerSeat" &&
        key !== "bookedSeats" &&
        req.body[key] !== undefined
      ) {
        bus[key] = req.body[key];
      }
    });

    // Handle pricePerSeat
    if (req.body.pricePerSeat !== undefined) {
      const pricePerSeatNumber = Number(req.body.pricePerSeat);
      if (isNaN(pricePerSeatNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pricePerSeat value",
        });
      }
      bus.pricePerSeat = pricePerSeatNumber;
      console.log("Updated Bus Price Per Seat:", bus.pricePerSeat);
    }

    // ✅ FIXED: Handle bookedSeats including empty arrays
    if ("bookedSeats" in req.body) {
      try {
        bus.bookedSeats = Array.isArray(req.body.bookedSeats)
          ? req.body.bookedSeats
          : JSON.parse(req.body.bookedSeats);
        console.log("Updated bookedSeats:", bus.bookedSeats);
      } catch (error) {
        console.error("Error parsing bookedSeats:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid bookedSeats format",
        });
      }
    }

    // Handle Image Update (if any)
    if (req.files?.image) {
      const imagePath = handleFileUpload(req.files.image, res);
      if (imagePath === null) return; // Stop execution if upload failed
      bus.image = imagePath;
    }

    await bus.save();
    res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bus",
      error: error.message,
    });
  }
};

// Delete Bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Delete Image File if Exists
    if (bus.image) {
      const filePath = path.join(__dirname, "..", bus.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await bus.deleteOne();
    res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete bus",
      error: error.message,
    });
  }
};