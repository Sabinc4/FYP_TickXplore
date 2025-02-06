const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Bus"], default: "Bus" },
    pricePerSeat: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },

    pickupPoint: { type: String, required: true, trim: true },
    dropPoint: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true, min: 1 }, 
    bookedSeats: [{ type: Number }], 
    tripDate: { type: Date, required: true }, 

    // New Field: Departure Date
    takeOffDate: { type: Date, required: true }, // Departure Date

  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", BusSchema);
