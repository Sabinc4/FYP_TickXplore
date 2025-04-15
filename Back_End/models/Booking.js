const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Optional references
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

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

    // 🔵 Cash on Visit
    paymentMethod: {
      type: String,
      enum: ["Online", "CashOnVisit"],
      default: "Online"
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "CashOnVisit"],
      default: "Pending"
    },

    // 🔁 Refund fields
    isRefunded: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
