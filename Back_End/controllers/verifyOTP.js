const mongoose = require("mongoose");
const UserModel = require('../models/User');
const AdminModel = require('../models/Admin');
const VendorModel = require('../models/Vendor');

exports.verifyOTP = async (req, res) => {
  const { email, otp, role } = req.body;

  let userModel;

  // Check the role and choose the correct model
  if (role === "user") {
    userModel = UserModel;
  } else if (role === "vendor") {
    userModel = VendorModel;
  } else if (role === "admin") {
    userModel = AdminModel;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    console.log('Verifying OTP for email:', email, 'with role:', role); // Debugging line
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check OTP validity and expiration
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP
    user.otpExpires = null; // Clear OTP expiration time
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};
