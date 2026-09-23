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
      required: false,
      default: "",
      trim: true,
    },
    vendorLocation: {
      type: String,
      required: false,
      default: "Pending",
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
      required: false,
      unique: true,
      sparse: true,
      match: /^[0-9]{7,15}$/, // Accepts 7–15 digit phone numbers
    },
    password: {
      type: String,
      required: false,
      minlength: 6, // Minimum password length
    },
    googleId: {
      type: String,
      sparse: true,
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
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    applicationReason: {
      type: String,
      default: "",
      trim: true,
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
    totalEarnings: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Apply unique validation to the schema
VendorSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const VendorModel = mongoose.model("Vendor", VendorSchema);
module.exports = VendorModel;
