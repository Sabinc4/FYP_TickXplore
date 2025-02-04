const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Bus", "4x4 Car", "Jeep", "Scorpio"], required: true },
  pricePerDay: { type: Number, required: true, min: [1, "Price must be greater than 0"] },
  image: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
