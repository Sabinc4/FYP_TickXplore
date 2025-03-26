const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
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
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{7,15}$/, // Accepts 7–15 digits
    },
    resetCode: String,
resetCodeExpires: Date,
    role: {
      type: String,
      required: true,
      default: "admin",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    otp: { type: String },
    otpExpires: { type: Date }
  },
  { timestamps: true }
);

// Apply unique validator plugin
AdminSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
