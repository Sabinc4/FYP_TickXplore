const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/", userController.createUser);
// Get all users
router.get("/", userController.getAllUsers);
// Get a single user by userId
router.get("/:id", userController.getUserById);
// Update an existing user by userId
router.put("/:id", userController.updateUser);
// Delete a user by userId
router.delete("/:id", userController.deleteUser);

module.exports = router;


