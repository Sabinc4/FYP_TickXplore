const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    // Reference to the Vehicle being reserved
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", // Reference to the Vehicle model
      required: true,
    },

    // Reference to the User making the reservation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },

    // Pickup and Drop-off Locations
    pickupPoint: {
      type: String,
      required: true,
      trim: true,
    },
    dropPoint: {
      type: String,
      required: true,
      trim: true,
    },

    // Reservation Timeframe
    reservedFrom: {
      type: Date,
      required: true,
    },
    reservedUntil: {
      type: Date,
      required: true,
    },

    // Payment Information (optional, if you want to track payments)
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "CashOnVisit"], 
      default: "pending",
    },
    paymentId: {
      type: String, // Store payment gateway ID (e.g., from Khalti, PayPal, etc.)
      trim: true,
    },

    // Additional Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

// Add indexes for faster queries
reservationSchema.index({ vehicleId: 1, userId: 1 });

// Middleware to update the `updatedAt` field before saving
reservationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;