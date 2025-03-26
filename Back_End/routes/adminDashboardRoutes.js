const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const vendorController = require("../controllers/vendorController");
const adminController = require("../controllers/adminController");

// Routes for dashboard data
router.get("/get-users", userController.getAllUsers);
router.get("/get-vendors", vendorController.getAllVendors);
router.get("/get-admins", adminController.getAllAdmins);

module.exports = router;
