const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// ✅ Get all vehicles
router.get("/", vehicleController.getAllVehicles);

// ✅ Get a specific vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

module.exports = router;
