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
    
    // Array to store seat numbers that have been booked
    bookedSeats: [{ type: Number, min: 1 }], 

    tripDate: { type: Date, required: true }, 
    takeOffDate: { type: Date, required: true }, // Departure Date
  },
  { timestamps: true }
);

// 🎯 Virtual field to calculate remaining seats dynamically
BusSchema.virtual("remainingSeats").get(function () {
  return this.totalSeats - this.bookedSeats.length;
});

// Ensure virtuals are included in JSON output
BusSchema.set("toJSON", { virtuals: true });
BusSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Bus", BusSchema);
