const express = require("express");
const { getPrice } = require("../controllers/bookingController");

const router = express.Router();

// ✅ Define routes and call controller functions
router.post("/get-price", getPrice);

// ✅ Export router
module.exports = router;
