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
router.get("/profile", verifyToken, adminController.getProfile);
router.get("/:id", adminController.getAdminById);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

//Toggle Vendor Activation
router.put(
  "/toggle-vendor/:vendorId",
  protect,
  authorize("admin"),
  vendorController.toggleVendorStatus
);

module.exports = router;
