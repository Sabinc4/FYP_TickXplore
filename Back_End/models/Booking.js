const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.endDate ? value < this.endDate : true;
        },
        message: "Start date must be before the end date.",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.startDate ? value > this.startDate : true;
        },
        message: "End date must be after the start date.",
      },
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (value) {
          return parseFloat(value.toString()) > 0;
        },
        message: "Price must be greater than 0.",
      },
    },
    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure unique active booking per vehicle within the same timeframe
BookingSchema.index({ vehicleId: 1, startDate: 1, endDate: 1 }, { unique: true });

// Convert Decimal128 price before sending JSON response
BookingSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.price = parseFloat(ret.price.toString()); // Convert Decimal128 to float
    return ret;
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
