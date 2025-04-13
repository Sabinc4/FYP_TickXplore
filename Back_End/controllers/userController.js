const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const UserModel = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// Forgot Password (Initiates password reset process)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // Reset code expires in 10 minutes
    await user.save();

    await sendEmail(email, "TickXplore - Reset Password", `<p>Your OTP is <b>${resetCode}</b>. It will expire in 10 minutes.</p>`);

    res.json({ success: true, message: "Reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send reset code" });
  }
};

// Reset Password (Updates password after OTP verification)
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.resetCode !== code || user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// Get User by ID (Admin)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
  }
};

// Update User (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Prepare updateData
    const updateData = { ...req.body };

    // Step 2: Handle file upload if present
    if (req.files && req.files.profilePhoto) {
      const photo = req.files.profilePhoto;

      // Ensure uploads directory exists
      const uploadPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const filename = `user-${Date.now()}-${photo.name}`;
      const filepath = path.join(uploadPath, filename);

      // Move file
      await photo.mv(filepath);

      // Save photo path (URL accessible)
      updateData.profilePhoto = `http://localhost:3001/uploads/${filename}`;
    }

    // Step 3: Update the user in DB
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// Delete User (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};
