const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const vendorController = require("../controllers/vendorController");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Destructure the needed controllers from authController
const {
  signIn,
  register,
  verifyOTP,
  verifyResetOtp,
  resetPassword,
  changePassword,
} = authController;

// Auth routes
router.post("/register", register);
router.post("/sign-in", signIn);
router.post("/users/register", register);
router.post("/verify-otp", verifyOTP);

// Forgot/Reset Password Routes
router.post("/forgot-password/admin", adminController.forgotPassword);
router.post("/forgot-password/vendor", vendorController.forgotPassword);
router.post("/forgot-password/user", userController.forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// ✅ This line was crashing because `changePassword` was NOT destructured before
router.post("/change-password/:role", protect, changePassword);



module.exports = router;
