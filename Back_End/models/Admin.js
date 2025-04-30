const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{7,15}$/,
  },
  resetCode: String,
  resetCodeExpires: Date,
  role: { type: String, required: true, default: "admin" },
  password: { type: String, required: true, minlength: 6 },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  profilePhoto: { type: String, default: "" },
  totalCommission: { type: Number, default: 0 },
}, { timestamps: true });

adminSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
