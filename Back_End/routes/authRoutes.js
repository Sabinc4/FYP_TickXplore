const express = require("express");
const { signIn, signUp } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const router = express.Router();

//Limit login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { message: " Too many login attempts. Please try again later." },
});

//Validation for sign-up
const validateSignUp = [
  body("email").isEmail().withMessage(" Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage(" Password must be at least 6 characters"),
];

//Authentication Routes (NO JWT REQUIRED)
router.post("/sign-in", loginLimiter, signIn);
router.post("/sign-up", validateSignUp, signUp);

module.exports = router;
