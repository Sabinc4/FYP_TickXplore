const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
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
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{7,15}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["user"], 
      default: "user",
    },
    resetCode: String,
    resetCodeExpires: Date,
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Apply unique validator
UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
