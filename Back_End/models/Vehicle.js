const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  isAvailable: { type: Boolean, default: true },
  totalEarnings: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  reservations: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reservedFrom: { type: Date },
      reservedUntil: { type: Date },
      pickupPoint: { type: String },
      dropPoint: { type: String },
    },
  ],
  currentLocation: {
    latitude: { type: Number },   
    longitude: { type: Number},
    updatedAt: { type: Date, },
  },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
