const mongoose = require("mongoose");

const refundRequestSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refundAmount: { type: Number, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

module.exports = mongoose.model("RefundRequest", refundRequestSchema);
