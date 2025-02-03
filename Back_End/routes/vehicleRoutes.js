const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// ✅ Add a Vehicle
router.post("/add-vehicle", vehicleController.upload.single("image"), vehicleController.addVehicle);

module.exports = router;
