// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  pickupPoint: {
    type: String,
    required: true, 
  },
  dropPoint: {
    type: String,
    required: true, 
  },
  capacity: {
    type: Number,
    required: true, 
  },
  price: {
    type: Number,
    required: true, 
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor", 
    required: true, 
  },
  takeOffDate: {
    type: Date,
    required: true, 
  },
  isAvailable: {
    type: Boolean,
    default: false, 
  },
  reservations: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
      },
      takeOffDate: {
        type: Date,
        required: true, 
      },
    },
  ],
});

// Create the Vehicle model
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;