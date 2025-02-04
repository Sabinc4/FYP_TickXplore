const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");

//SIGN-IN Controller
exports.signIn = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.trim();
    password = password.trim();

    // Find the user in any of the models
    const models = [UserModel, VendorModel, AdminModel];
    let user = null;
    for (const model of models) {
      user = await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(400).json({ message: "User not found. Please check your email." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// SIGN-UP Controller
exports.signUp = async (req, res) => {
  let { name, email, password, confirmPassword, location, role, vendorName, vendorLocation } = req.body;

  try {
    // 🔹 Trim inputs
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    name = name ? name.trim() : "";
    location = location ? location.trim() : "";
    vendorName = vendorName ? vendorName.trim() : "";
    vendorLocation = vendorLocation ? vendorLocation.trim() : "";

    //Validate required fields
    if (!name || !email || !password || !confirmPassword || !location || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Ensure email is unique across all models
    const models = [UserModel, VendorModel, AdminModel];
    let existingUser = null;
    for (const model of models) {
      existingUser = await model.findOne({ email });
      if (existingUser) break;
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists. Please use a different email." });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    if (role === "user") {
      newUser = await UserModel.create({ name, email, password: hashedPassword, location, role: "user" });
    } else if (role === "vendor") {
      if (!vendorName || !vendorLocation) {
        return res.status(400).json({ message: "Vendor name and location are required." });
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
    } else {
      return res.status(400).json({ message: "Invalid role. Allowed values: user, vendor, admin." });
    }

    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err) {
    console.error("❌ Sign-up error:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};
