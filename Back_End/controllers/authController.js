const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");

// ✅ SIGN-IN Controller
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email }) ||
               await VendorModel.findOne({ email }) ||
               await AdminModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Redirect URL based on role
    const redirectURL = user.role === "admin"
      ? "/Admin_Dashboard"
      : user.role === "vendor"
      ? "/Vendor_Dashboard"
      : "/";

    return res.json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
      user,
      redirectURL,
    });
  } catch (err) {
    console.error("❌ Sign-in error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ SIGN-UP Controller
exports.signUp = async (req, res) => {
  const { name, email, password, confirmPassword, location, role, vendorName, vendorLocation } = req.body;

  if (!name || !email || !password || !confirmPassword || !location || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    let existingUser = await UserModel.findOne({ email }) ||
                       await VendorModel.findOne({ email }) ||
                       await AdminModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    if (role === "user") {
      newUser = await UserModel.create({ name, email, password: hashedPassword, location, role: "user" });
    } else if (role === "vendor") {
      if (!vendorName || !vendorLocation) {
        return res.status(400).json({ message: "Vendor name and location required." });
      }
      newUser = await VendorModel.create({
        vendorName,
        vendorLocation,
        email,
        password: hashedPassword,
        isActive: false,
        role: "vendor",
      });
    } else if (role === "admin") {
      newUser = await AdminModel.create({
        name,
        location,
        email,
        password: hashedPassword,
        role: "admin",
      });
    }

    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error creating user: " + err.message });
  }
};
