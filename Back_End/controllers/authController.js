const bcrypt = require("bcryptjs");
const AdminModel = require('../models/Admin');
const VendorModel = require('../models/Vendor');
const UserModel = require('../models/User');
const generateToken = require("../utils/generateToken");
const sendOTP = require("../utils/sendOTP");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const Booking = require("../models/Booking");

// SIGN-IN Controller: Send OTP for login
exports.signIn = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.trim();
    password = password.trim();

    const models = [AdminModel, VendorModel, UserModel];
    let user = null;
    let role = null;

    for (const model of models) {
      user = await model.findOne({ email });
      if (user) {
        role = model.modelName.toLowerCase(); // "admin", "vendor", or "user"
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "User not found. Please check your email." });
    }

    // 🔒 Check if vendor is active
    if (role === "vendor" && user.isActive === false) {
      return res.status(403).json({ message: "Your vendor account is not active" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await sendOTP(email, otp);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    return res.status(200).json({
      message: "Login successful. Please verify your OTP.",
      userId: user._id,
      requireOTP: true
    });

  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// OTP Verification: Second step of login after user enters OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp, userId } = req.body;

  try {
    const sanitizedEmail = email.trim();
    const sanitizedOTP = otp.trim();
    const sanitizedUserId = userId?.trim();

    const models = [UserModel, VendorModel, AdminModel];
    let user = null;

    for (const model of models) {
      user = await model.findOne({ _id: sanitizedUserId, email: sanitizedEmail });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.otp || user.otp !== sanitizedOTP) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(401).json({ message: "OTP has expired." });
    }

    const token = generateToken(user._id, user.role);

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// SIGN-UP Controller
exports.signUp = async (req, res) => {
  let { name, email, password, confirmPassword, location, phoneNumber, role, vendorName, vendorLocation } = req.body;

  try {
    // Trim input fields to remove extra spaces
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    phoneNumber = phoneNumber.trim();

    // Validate required fields
    if (!email || !password || !confirmPassword || !location || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Generate OTP and send to email for verification
    const otp = generateOTP();
    await sendOTP(email, otp); // Send OTP to email

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);
    let newUser;

    // Create user based on role
    if (role === "user") {
      newUser = await UserModel.create({ name, email, password: hashedPassword, location, phoneNumber, role: "user" });
    } else if (role === "vendor") {
      newUser = await VendorModel.create({ vendorName, vendorLocation, email, password: hashedPassword, phoneNumber, role: "vendor", isActive: false });
    } else if (role === "admin") {
      newUser = await AdminModel.create({ name, email, password: hashedPassword, location, phoneNumber, role: "admin" });
    }

    res.status(200).json({ message: "Registration successful. Please verify your OTP." });
  } catch (err) {
    console.error("Sign-up error:", err);
    res.status(500).json({ message: "Error during registration", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { role } = req.params; 
  let userModel;

  // Determine which model to use based on the role
  if (role === "admin") {
    userModel = AdminModel;
  } else if (role === "vendor") {
    userModel = VendorModel;
  } else if (role === "user") {
    userModel = UserModel;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset code and expiration time
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Send the reset code to the user's email
    await sendEmail(user.email, "Reset Password OTP", `<p>Your reset code is: ${resetCode}</p>`);

    res.status(200).json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error("Error sending reset code:", err);
    res.status(500).json({ message: "Error sending reset code", error: err.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  const { email, otp, role } = req.body;
  let userModel;

  if (role === "admin") userModel = AdminModel;
  else if (role === "vendor") userModel = VendorModel;
  else if (role === "user") userModel = UserModel;
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await userModel.findOne({ email });

    if (!user || user.resetCode !== otp || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, role } = req.body;
  let userModel;

  if (role === "admin") {
    userModel = require("../models/Admin");
  } else if (role === "vendor") {
    userModel = require("../models/Vendor");
  } else if (role === "user") {
    userModel = require("../models/User");
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.resetCode) {
      return res.status(404).json({ message: "Invalid or expired request" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("busId", "name pickupPoint dropPoint")
      .populate("vehicleId", "name price");

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Admin Bookings Error:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

