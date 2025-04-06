const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Optional references
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },     // For bus bookings
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // For vehicle bookings

    selectedSeats: [{ type: Number }], // For buses
    totalPrice: { type: Number, required: true },

    transactionId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Booked", "Cancelled"],
      default: "Pending",
    },
    takeOffDate: { type: Date },
    reservationDate: { type: Date }, // For vehicle booking

    // 🔥 These fields are used only for vehicles (entered by user)
    pickupPoint: { type: String, trim: true },
    dropPoint: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);