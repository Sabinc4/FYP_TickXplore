// Load environment variables
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// Import models
const UserModel = require("./models/Users");
const VendorModel = require("./models/Vendor");
const AdminModel = require("./models/Admin");

const app = express();
app.use(express.json());
app.use(cors());

// Debug: Check if MONGO_URI is loaded correctly
console.log("MongoDB URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Sign-in route
app.post("/sign-in", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user, vendor, admin;
    let isUserMatch = false, isVendorMatch = false, isAdminMatch = false;

    if (role === "user") {
      user = await UserModel.findOne({ email });
      if (user) {
        isUserMatch = await bcrypt.compare(password, user.password);
      }
    } else if (role === "vendor") {
      vendor = await VendorModel.findOne({ email });
      if (vendor) {
        isVendorMatch = await bcrypt.compare(password, vendor.password);
      }
    } else if (role === "admin") {
      admin = await AdminModel.findOne({ email });
      if (admin) {
        isAdminMatch = await bcrypt.compare(password, admin.password);
      }
    }

    // Check if any user found and password matches
    if ((!user && !vendor && !admin) || (!isUserMatch && !isVendorMatch && !isAdminMatch)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let loggedInUser;
    if (isUserMatch) {
      loggedInUser = user;
    } else if (isVendorMatch) {
      loggedInUser = vendor;
    } else if (isAdminMatch) {
      loggedInUser = admin;
    }

    return res.json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      user: loggedInUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword, location, role, vendorName, vendorLocation } = req.body;
  
    if (!name || !email || !password || !confirmPassword || !location || !role) {
      return res.status(400).json("All fields are required.");
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json("Passwords do not match.");
    }
  
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email format.");
    }
  
    try {
      let existingUser;
      if (role === "user") {
        existingUser = await UserModel.findOne({ email });
      } else if (role === "vendor") {
        existingUser = await VendorModel.findOne({ email });
      } else if (role === "admin") {
        existingUser = await AdminModel.findOne({ email });
      }
  
      if (existingUser) {
        return res.status(400).json("Email already exists.");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      let newUser;
      if (role === "user") {
        newUser = await UserModel.create({ name, email, password: hashedPassword, location, role: 'user' });
      } else if (role === "vendor") {
        if (!vendorName || !vendorLocation) {
          return res.status(400).json("Vendor name and location required.");
        }
        newUser = await VendorModel.create({
          vendorName,
          vendorLocation,
          email,
          password: hashedPassword,
          isActive: false,
          role: 'vendor' 
        });
      } else if (role === "admin") {
        newUser = await AdminModel.create({
          name,
          location,
          email,
          password: hashedPassword,
          role: 'admin'
        });
      }
  
      return res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`, user: newUser });
  
    } catch (err) {
      console.error(err);
      res.status(500).json("Error creating user: " + err.message);
    }
  });  

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
