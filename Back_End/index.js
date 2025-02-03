// Load environment variables
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Import models
const UserModel = require("./models/User");
const VendorModel = require("./models/Vendor");
const AdminModel = require("./models/Admin");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging: Check if MONGO_URI is loaded correctly
console.log("MongoDB URI:", process.env.MONGO_URI);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/**
 * ✅ SIGN-IN Route
 * - Authenticates users based on role.
 */
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user =
      (await UserModel.findOne({ email })) ||
      (await VendorModel.findOne({ email })) ||
      (await AdminModel.findOne({ email }));

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Redirect URL based on role
    const redirectURL =
      user.role === "admin"
        ? "/Admin_Dashboard"
        : user.role === "vendor"
        ? "/vendor-dashboard"
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
});

/**
 * ✅ SIGN-UP Route
 * - Registers a new User, Vendor, or Admin.
 */
app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, location, role, vendorName, vendorLocation } = req.body;

  if (!name || !email || !password || !confirmPassword || !location || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    // Check if user already exists
    let existingUser =
      (await UserModel.findOne({ email })) ||
      (await VendorModel.findOne({ email })) ||
      (await AdminModel.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Secure password hashing
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

    return res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      user: newUser,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Error creating user: " + err.message });
  }
});

app.get("/admin/get-users", async (req, res) => {
  try {
    const users = await UserModel.find({}, "userId name email location role");
    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "❌ Error fetching users", error });
  }
});


/**
 * ✅ GET ALL VENDORS
 */
app.get("/admin/get-vendors", async (req, res) => {
  try {
    const vendors = await VendorModel.find({}, "vendorId vendorName email vendorLocation role isActive");
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching vendors", error });
  }
});

/**
 * ✅ GET ALL ADMINS
 */
app.get("/admin/get-admins", async (req, res) => {
  try {
    const admins = await AdminModel.find({}, "adminId name email location role");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching admins", error });
  }
});

/**
 * ✅ GET DASHBOARD STATS
 */
app.get("/admin/get-stats", async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
    const vendorsCount = await VendorModel.countDocuments();
    const adminsCount = await AdminModel.countDocuments();

    res.json({
      users: usersCount || 0,
      vendors: vendorsCount || 0,
      admins: adminsCount || 0,
      buses: 0, 
      vehicles: 0, 
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching stats", error });
  }
});

/**
 * ✅ TOGGLE VENDOR ACTIVE/INACTIVE
 */
app.put("/admin/toggle-vendor/:id", async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.json({ message: `Vendor is now ${vendor.isActive ? "Active" : "Inactive"}`, vendor });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating vendor status", error });
  }
});

/**
 * ✅ DELETE USER
 */
app.delete("/admin/delete-user/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting user", error });
  }
});

/**
 * ✅ DELETE VENDOR
 */
app.delete("/admin/delete-vendor/:id", async (req, res) => {
  try {
    const vendor = await VendorModel.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting vendor", error });
  }
});

/**
 * ✅ SERVER START
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
