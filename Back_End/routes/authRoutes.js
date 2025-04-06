const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const vendorController = require("../controllers/vendorController");
const userController = require("../controllers/userController");

const {
  signIn,
  signUp,
  verifyOTP,
  verifyResetOtp,
  resetPassword,
  getAllBookings
} = authController;

// Auth routes
router.post("/register", authController.register);
router.post("/sign-in", authController.signIn);
router.post('/users/register', authController.register); 
router.post("/verify-otp", authController.verifyOTP);

// Forgot/Reset Password Routes
router.post("/forgot-password/admin", adminController.forgotPassword); 
router.post("/forgot-password/vendor", vendorController.forgotPassword); 
router.post("/forgot-password/user", userController.forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.get("/bookings", getAllBookings);

module.exports = router;
