const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const generateToken = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");

//Register Vendor
exports.registerVendor = async (req, res) => {
  try {
    const { vendorName, vendorLocation, email, phoneNumber, password } = req.body;

    if (!vendorName || !vendorLocation || !email || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await Vendor.create({
      vendorName,
      vendorLocation,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully. Wait for admin activation.",
      vendor: { _id: vendor._id, email: vendor.email, isActive: vendor.isActive },
    });
  } catch (error) {
    console.error("Error registering vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login Vendor (Only if Active)
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!vendor.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is not yet activated by admin.",
      });
    }

    const token = generateToken(vendor._id, vendor.role);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      vendor: {
        _id: vendor._id,
        vendorName: vendor.vendorName,
        email: vendor.email,
        role: vendor.role,
      },
    });
  } catch (error) {
    console.error("Error logging in vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Vendor Profile
exports.getProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select("-password").lean();
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

//Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    vendor.resetCode = resetCode;
    vendor.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await vendor.save();

    await sendEmail(
      email,
      "TickXplore - Reset Password OTP",
      `<p>Your reset code is <b>${resetCode}</b>. It expires in 10 minutes.</p>`
    );

    res.json({ success: true, message: "Reset code sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send reset code" });
  }
};

//Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor || vendor.resetCode !== code || vendor.resetCodeExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    vendor.password = await bcrypt.hash(newPassword, 10);
    vendor.resetCode = null;
    vendor.resetCodeExpires = null;
    await vendor.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

// Admin: Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password").lean();
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin: Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }

    const vendor = await Vendor.findById(id).select("-password");
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin: Update Vendor (can activate from here)
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Optional: Notify vendor if activated
    // if (req.body.isActive === true) {
    //   await sendEmail(updatedVendor.email, "TickXplore - Account Activated", `<p>Your vendor account has been approved. You may now log in.</p>`);
    // }

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor updated successfully", updatedVendor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//ToggleVendorStatus
exports.toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.status(200).json({
      message: `Vendor ${vendor.isActive ? "activated" : "deactivated"} successfully`,
      vendor,
    });
  } catch (error) {
    console.error("Error toggling vendor status:", error);
    res.status(500).json({ message: "Failed to toggle vendor status" });
  }
};

//Admin: Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }

    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
