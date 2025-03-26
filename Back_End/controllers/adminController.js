const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); 

//Create New Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, location, email, phoneNumber, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, location, email, phoneNumber, password: hashed });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
};

//Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    await sendEmail(admin.email, "TickXplore - Admin OTP", `<p>Your OTP is <b>${otp}</b></p>`);

    res.status(200).json({
      message: "OTP sent to email",
      userId: admin._id,
      requireOTP: true
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

//Verify Admin OTP
exports.verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp, userId } = req.body;

    // Step 1: Find the admin by ID and email
    const admin = await Admin.findOne({ _id: userId, email });

    // Step 2: Validate OTP
    if (!admin || admin.otp !== otp || new Date() > admin.otpExpires) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Step 3: Clear OTP fields
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    // ✅ Step 4: Generate token with all 3 arguments (_id, role, email)
    const token = generateToken(admin._id, admin.role, admin.email);

    // Step 5: Return success
    res.status(200).json({
      message: "OTP verified",
      token,
      user: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({
      message: "OTP verification error",
      error: err.message,
    });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetCode = resetCode;
    admin.resetCodeExpires = Date.now() + 10 * 60 * 1000; 

    await admin.save();

    // Send reset code email
    await sendEmail(
      email,
      "Password Reset OTP",
      `<p>Your reset code is <b>${resetCode}</b>. It expires in 10 minutes.</p>`
    );

    return res.status(200).json({
      message: "Password reset code sent to your email",
    });
  } catch (err) {
    console.error("Error sending reset code:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || admin.resetCode !== code || Date.now() > admin.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetCode = undefined;
    admin.resetCodeExpires = undefined;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

//Get Profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Error getting profile", error: err.message });
  }
};

//Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ admins });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admins", error: err.message });
  }
};

//Get Admin By ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin by ID", error: err.message });
  }
};

//Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (updateFields.password) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }

    const updated = await Admin.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");
    res.json({ message: "Admin updated", admin: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating admin", error: err.message });
  }
};

exports.toggleVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    //Toggle isActive
    vendor.isActive = !vendor.isActive;
    await vendor.save();

    //Send email if vendor was just activated
    if (vendor.isActive) {
      console.log("📧 Sending activation email to:", vendor.email);
      await sendEmail(
        vendor.email,
        "🎉 Your Vendor Account is Now Active",
        `
          <h2>Hello ${vendor.vendorName},</h2>
          <p>🎉 Great news! Your vendor account on <strong>TickXplore</strong> has been activated by the admin.</p>
          <p>You can now log in and start managing your listings!</p>
          <p><a href="http://localhost:5173/login">Click here to log in</a></p>
          <br/>
          <p>Welcome aboard!<br/>— Team TickXplore</p>
        `
      );
    }

    res.status(200).json({
      message: `Vendor ${vendor.isActive ? "activated" : "deactivated"} successfully`,
      vendor,
    });

  } catch (error) {
    console.error("Error toggling vendor status:", error);
    res.status(500).json({ message: "Failed to toggle vendor status" });
  }
};

//Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting admin", error: err.message });
  }
};
