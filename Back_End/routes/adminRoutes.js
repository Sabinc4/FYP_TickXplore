const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken");

// Admin Authentication
router.post("/forgot-password", adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);

// Admin Profile & Listings
router.get("/profile", verifyToken, adminController.getProfile);
router.get("/all", verifyToken, adminController.getAllAdmins);

//  MUST come before `/:id`
router.get("/bookings", verifyToken, adminController.getAllBookings);

// Always put dynamic routes last
router.get("/:id", verifyToken, adminController.getAdminById);
router.put("/:id", verifyToken, adminController.updateAdmin);
router.delete("/:id", verifyToken, adminController.deleteAdmin);

// Support old toggle route
router.put("/toggle-vendor/:vendorId", verifyToken, adminController.toggleVendorStatus);

// Vendor Management
router.put("/vendor/:vendorId/status", verifyToken, adminController.toggleVendorStatus);
router.put("/vendor/:vendorId", verifyToken, adminController.editVendorByAdmin);
router.delete("/vendor/:vendorId", verifyToken, adminController.deleteVendorByAdmin);


// User Management
router.put("/user/:userId", verifyToken, adminController.editUserByAdmin);
router.delete("/user/:userId", verifyToken, adminController.deleteUserByAdmin);

module.exports = router;
