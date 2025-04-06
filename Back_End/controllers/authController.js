const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const AdminModel = require('../models/Admin');
const VendorModel = require('../models/Vendor');
const UserModel = require('../models/User');
const generateToken = require("../utils/generateToken");
const { sendEmail, sendSignupOTP } = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");
const Booking = require("../models/Booking");

exports.register = async (req, res) => {
  console.log("Registration data received:", req.body);

  const { name, location, email, phoneNumber, password, confirmPassword, role, vendorName, vendorLocation } = req.body;

  try {
    // Validate all required fields
    if (!name || !location || !email || !phoneNumber || !password || !confirmPassword || !role || (role === "vendor" && (!vendorName || !vendorLocation))) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();

    let newUser;
    if (role === "user") {
      newUser = await UserModel.create({
        name,
        location,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,  // OTP expires in 10 minutes
        isVerified: false,
      });
    } else if (role === "vendor") {
      newUser = await VendorModel.create({
        name,
        location,
        vendorName,
        vendorLocation,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
        isVerified: false,
      });
    } else if (role === "admin") {
      newUser = await AdminModel.create({
        name,
        location,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
        isVerified: false,
      });
    }

    // Send OTP email
    await sendSignupOTP(email, otp);

    // Send welcome email for Gmail users
    if (email.endsWith("@gmail.com")) {
      const displayName = name || "there";
      await sendEmail(email, " Welcome to TickXplore", `
        <h2>Hello ${displayName},</h2>
        <p>We're excited to have you onboard TickXplore!</p>
        <p>Start exploring and booking your next adventure today!</p>
      `);
    }

    res.status(201).json({
      message: "Registration successful. Please verify the OTP sent to your email.",
      user: { email, role, _id: newUser._id },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};


// Sign-in Controller
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }) || 
                 await VendorModel.findOne({ email }) || 
                 await AdminModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account is not verified. Please verify your OTP." });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Sign-in error:", error.message);
    res.status(500).json({ message: "Error during sign-in", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  console.log("Verifying OTP for userId:", userId, "with OTP:", otp);

  try {
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let user = await UserModel.findById(userId) || 
               await VendorModel.findById(userId) || 
               await AdminModel.findById(userId);

    if (!user) return res.status(400).json({ message: "User not found." });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
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
      .populate("vehicleId", "name price")
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map(b => ({
      ...b._doc,
      user: b.userId,    
      bus: b.busId,
      vehicle: b.vehicleId
    }));

    res.status(200).json({ bookings: formattedBookings });
  } catch (err) {
    console.error("Admin Bookings Error:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

