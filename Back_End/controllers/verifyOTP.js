const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");
const generateToken = require("../utils/generateToken");

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, userId } = req.body;

    if (!email || !otp || !userId) {
      return res.status(400).json({
        success: false,
        message: "Email, User ID, and OTP are required",
      });
    }

    // Sanitize input
    const sanitizedEmail = email.toString().trim();
    const sanitizedOTP = otp.toString().trim();
    const sanitizedUserId = userId.toString().trim();

    console.log("OTP VERIFICATION STARTED");
    console.log("Received:", { email, otp, userId });
    console.log("Sanitized:", { sanitizedEmail, sanitizedOTP, sanitizedUserId });

    // Validate OTP format (6-digit)
    if (!/^\d{6}$/.test(sanitizedOTP)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    // Try finding the user in all models using both userId and email
    const user =
      (await UserModel.findOne({ _id: sanitizedUserId, email: sanitizedEmail })) ||
      (await VendorModel.findOne({ _id: sanitizedUserId, email: sanitizedEmail })) ||
      (await AdminModel.findOne({ _id: sanitizedUserId, email: sanitizedEmail }));

    console.log("User found:", user?._id?.toString(), "OTP stored:", user?.otp);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP exists and matches
    if (!user.otp || user.otp !== sanitizedOTP) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiration
    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired",
      });
    }

    //FIXED: Generate token with correct format
    const token = generateToken(user._id, user.role, user.email);

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Prepare user data to return
    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name || user.vendorName,
      ...(user.role === "vendor" && {
        vendorName: user.vendorName,
        vendorLocation: user.vendorLocation,
      }),
    };

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: userData,
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
