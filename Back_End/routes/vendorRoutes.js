const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

// Vendor Authentication Routes
router.post("/forgot-password", vendorController.forgotPassword); 
router.post("/reset-password", vendorController.resetPassword);  

// Admin Routes to Get and Manage Vendors
router.get("/", vendorController.getAllVendors);  
router.get("/:id", vendorController.getVendorById); 
router.put("/:id", vendorController.updateVendor);  
router.delete("/:id", vendorController.deleteVendor);  

// Vendor Profile Routes (Protected)
router.get("/profile", vendorController.getProfile);  

// Toggle Vendor Status (Activate/Deactivate)
router.patch("/status/:vendorId", vendorController.toggleVendorStatus);  

module.exports = router;
