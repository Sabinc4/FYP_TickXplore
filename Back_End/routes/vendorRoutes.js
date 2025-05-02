const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const { getBookingsByVendor } = require("../controllers/refundController"); // ✅ Correct source
const { protect, authorize } = require("../middleware/authMiddleware");

// Vendor Auth
router.post("/forgot-password", vendorController.forgotPassword);
router.post("/reset-password", vendorController.resetPassword);

// ✅ Vendor Protected Bookings
router.get("/bookings", protect, authorize("vendor"), getBookingsByVendor);

// Admin Routes
router.get("/", vendorController.getAllVendors);  
router.get("/:id", vendorController.getVendorById); 
router.put("/:id", vendorController.updateVendor);  
router.delete("/:id", vendorController.deleteVendor);  

// Vendor Profile
router.get("/profile", vendorController.getProfile);

module.exports = router;
