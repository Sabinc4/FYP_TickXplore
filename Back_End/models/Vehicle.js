const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Bus", "4x4 Car", "Jeep", "Scorpio"], required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: true }, // Store image path
  isAvailable: { type: Boolean, default: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
