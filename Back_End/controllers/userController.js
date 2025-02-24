const mongoose = require("mongoose"); // Ensure mongoose is required
const User = require("../models/User");

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password for security
    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get User By ID (Handles ObjectId and Auto-Incremented userId)
exports.getUserById = async (req, res) => {
  try {
    let user;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      // If not a MongoDB ObjectId, check by userId (auto-incremented field)
      user = await User.findOne({ userId: req.params.id });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Create a New User
exports.createUser = async (req, res) => {
  try {
    const { name, location, email, password, role } = req.body;

    const newUser = new User({
      name,
      location,
      email,
      password, // Remember to hash password before saving in production!
      role, // Default role is "user" if not provided in schema
    });

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Update an Existing User (Handles ObjectId and userId)
exports.updateUser = async (req, res) => {
  try {
    const { name, location, email, password, role } = req.body;
    let user;

    // Check if ID is valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      // Otherwise, search by auto-incremented userId
      user = await User.findOne({ userId: req.params.id });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (location) user.location = location;
    if (email) user.email = email;
    if (password) user.password = password; // Hash password before saving in production!
    if (role) user.role = role;

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a User (Handles ObjectId and userId)
exports.deleteUser = async (req, res) => {
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findByIdAndDelete(req.params.id);
    } else {
      user = await User.findOneAndDelete({ userId: req.params.id });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
};
