const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware"); 

// If verifyToken is used for profile only, you can keep it
const verifyToken = require("../middleware/verifyToken");

//Auth Routes
router.post("/register", adminController.createAdmin); 
router.post("/login", adminController.loginAdmin);
router.post("/verify-otp", adminController.verifyAdminOTP);
router.post("/forgot-password", adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);

//Admin Routes
router.get("/", adminController.getAllAdmins);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);
router.put('/edit-user/:userId', protect, authorize("admin"), adminController.editUserByAdmin);
router.delete('/delete-user/:userId', protect, authorize("admin"), adminController.deleteUserByAdmin);
router.put('/edit-vendor/:vendorId', protect, authorize("admin"), adminController.editVendorByAdmin);
router.delete('/delete-vendor/:vendorId', protect, authorize("admin"), adminController.deleteVendorByAdmin);
router.get("/bookings", protect, authorize("admin"), adminController.getAllBookings);
//Toggle Vendor Activation
router.put(
  "/toggle-vendor/:vendorId",
  protect,
  authorize("admin"),
  vendorController.toggleVendorStatus
);

module.exports = router;
