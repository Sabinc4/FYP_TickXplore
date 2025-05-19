const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User Authentication Routes
router.post("/forgot-password", userController.forgotPassword); // Initiates password reset
router.post("/reset-password", userController.resetPassword); // Resets password

// Protected Routes
router.get("/profile", userController.getProfile); // Fetch user profile
router.get("/", userController.getAllUsers); // Get all users (for admin)
router.get("/:id", userController.getUserById); // Get a user by ID
router.put("/:id", userController.updateUser); // Update user details
router.delete("/:id", userController.deleteUser); // Delete a user
router.put("/:id/location", userController.updateUserLocation);

module.exports = router;
