const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// ✅ Get all buses
router.get("/", busController.getAllBuses);

// ✅ Get a specific bus by ID
router.get("/:id", busController.getBusById);

module.exports = router;
