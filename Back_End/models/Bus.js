const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Bus"], default: "Bus" },
  pricePerSeat: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  pickupPoint: { type: String, required: true, trim: true },
  dropPoint: { type: String, required: true, trim: true },
  totalSeats: { type: Number, required: true, min: 1 },
  bookedSeats: [{ type: Number, min: 1, default: [] }],
  takeOffDate: { type: Date, required: true },
  currentLocation: {
    latitude: { type: Number, },
    longitude: { type: Number, },
    updatedAt: { type: Date, },
  },
  totalEarnings: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual field to calculate remaining seats dynamically
busSchema.virtual("remainingSeats").get(function () {
  return this.totalSeats - (this.bookedSeats ? this.bookedSeats.length : 0);
});

// Include virtuals & getters in JSON output
busSchema.set("toJSON", { virtuals: true, getters: true });
busSchema.set("toObject", { virtuals: true, getters: true });

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;
