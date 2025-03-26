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

    bookedSeats: [{ type: Number, min: 1, default: [] }], 

    tripDate: { type: Date, required: true },
    takeOffDate: { type: Date, required: true },
  },
  { timestamps: true }
);

//Virtual field to calculate remaining seats dynamically
BusSchema.virtual("remainingSeats").get(function () {
  return this.totalSeats - (this.bookedSeats ? this.bookedSeats.length : 0);
});

//Include virtuals & getters in JSON output
BusSchema.set("toJSON", { virtuals: true, getters: true });
BusSchema.set("toObject", { virtuals: true, getters: true });

module.exports = mongoose.model("Bus", BusSchema);
