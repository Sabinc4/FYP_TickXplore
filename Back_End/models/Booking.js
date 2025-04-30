const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },

    selectedSeats: [{ type: Number }],
    totalPrice: { type: Number, required: true },
    transactionId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Booked", "Cancelled"],
      default: "Pending",
    },

    takeOffDate: { type: Date },
    reservationDate: { type: Date },
    pickupPoint: { type: String, default: "N/A" },
    dropPoint: { type: String, default: "N/A" },

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

    isRefunded: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date },

    // ✅ Commission fields
    commissionAmount: { type: Number, default: 0 },
    vendorEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
