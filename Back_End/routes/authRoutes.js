const express = require("express");
const { signIn, signUp } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);  // Fixed route name consistency

module.exports = router;
