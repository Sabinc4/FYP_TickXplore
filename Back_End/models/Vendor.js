const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Vendor Schema
const VendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true, // Ensure vendorId is unique
      default: () => `V${Math.floor(Math.random() * 1000000)}`, // Generate unique vendorId
    },
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
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Validate email format
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Unique constraint on phone number
      match: /^[0-9]{7,15}$/, // Accepts 7–15 digit phone numbers
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    role: {
      type: String,
      required: true,
      enum: ["vendor"], // Only vendor role allowed
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
      default: false, // Vendor is not verified initially
    },
    profilePhoto: {
      type: String,
      default: "", // Default empty string for profile photo
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Apply unique validation to the schema
VendorSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const VendorModel = mongoose.model("Vendor", VendorSchema);
module.exports = VendorModel;
