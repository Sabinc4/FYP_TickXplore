const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const vendorController = require("../controllers/vendorController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController")
const { signIn, signUp } = require("../controllers/authController");
const { verifyOTP } = require("../controllers/verifyOTP"); 

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/verify-otp", verifyOTP); 
router.post("/forgot-password/admin", adminController.forgotPassword); 
router.post("/forgot-password/vendor", vendorController.forgotPassword); 
router.post("/forgot-password/user", userController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;