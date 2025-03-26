const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  image: String,
  capacity: Number,
  price: Number,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  takeOffDate: Date,
  isAvailable: { type: Boolean, default: false },
  reservations: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reservedFrom: Date,
      reservedUntil: Date,
      pickupPoint: String,
      dropPoint: String,
    },
  ],
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;