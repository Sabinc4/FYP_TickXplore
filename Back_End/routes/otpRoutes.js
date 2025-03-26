// routes/otpRoutes.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Route to generate and send OTP
router.post('/send-otp', otpController.sendOTP);

// Route to verify OTP
router.post('/verify-otp', otpController.verifyOTP);

module.exports = router;
