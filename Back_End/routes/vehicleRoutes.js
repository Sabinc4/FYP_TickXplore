const express = require("express");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const router = express.Router();

// ✅ Get All Vehicles
router.get("/", getAllVehicles);

// ✅ Get a Vehicle by ID
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
// ✅ Create a New Vehicle
router.post("/", createVehicle);

// ✅ Delete a Vehicle
router.delete("/:id", deleteVehicle);

module.exports = router;
