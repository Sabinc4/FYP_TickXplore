// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  image: String,
  pickupPoint: String,
  dropPoint: String,
  capacity: Number,
  price: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  takeOffDate: Date,
  isAvailable: { type: Boolean, default: true },
  reservations: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      takeOffDate: Date,
    },
  ],
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;