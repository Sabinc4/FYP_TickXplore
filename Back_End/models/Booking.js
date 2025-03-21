const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Optional references
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }, // Only for buses
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // Only for vehicles

    selectedSeats: [{ type: Number }], // ✅ Only used if it's a bus booking
    totalPrice: { type: Number, required: true },

    transactionId: { type: String, unique: true }, 
    status: {
      type: String,
      enum: ["Pending", "Booked", "Cancelled"],
      default: "Pending",
    },
    reservationDate: { type: Date }, // ✅ For vehicle bookings only
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
