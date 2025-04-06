const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken"); 

// Admin Authentication Routes
router.post("/forgot-password", adminController.forgotPassword);  
router.post("/reset-password", adminController.resetPassword);  

// Admin Profile Routes
router.get("/profile", verifyToken, adminController.getProfile); 
router.get("/all", verifyToken, adminController.getAllAdmins);  
router.get("/:id", verifyToken, adminController.getAdminById); 
router.put("/:id", verifyToken, adminController.updateAdmin);  

// Admin Vendor Management Routes
router.put("/vendor/:vendorId/status", verifyToken, adminController.toggleVendorStatus);  
router.put("/vendor/:vendorId", verifyToken, adminController.editVendorByAdmin);  
router.delete("/vendor/:vendorId", verifyToken, adminController.deleteVendorByAdmin);  

// Admin User Management Routes
router.put("/user/:userId", verifyToken, adminController.editUserByAdmin);  
router.delete("/user/:userId", verifyToken, adminController.deleteUserByAdmin);  

// Admin Booking Management Routes
router.get("/bookings", verifyToken, adminController.getAllBookings);

// Admin Delete Routes
router.delete("/:id", verifyToken, adminController.deleteAdmin);  

module.exports = router;
