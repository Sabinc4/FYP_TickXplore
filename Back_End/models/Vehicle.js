const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Bus", "Car", "Jeep", "4x4"], required: true },
    pricePerSeat: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    pickupPoint: { type: String, required: true, trim: true },
    dropPoint: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true, min: 1 },
    
    // 🎯 Array to store seat numbers that have been booked
    bookedSeats: [{ type: Number, min: 1 }], 

    tripDate: { type: Date, required: true },
    takeOffDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
