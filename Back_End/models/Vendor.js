const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const VendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorLocation: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{7,15}$/, // Accepts 7–15 digit phone numbers
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["vendor"],
      default: "vendor",
    },
    isActive: {
      type: Boolean,
      default: false, 
    },
    resetCode: String,
    resetCodeExpires: Date,

    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Apply unique validation
VendorSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const VendorModel = mongoose.model("Vendor", VendorSchema);
module.exports = VendorModel;
