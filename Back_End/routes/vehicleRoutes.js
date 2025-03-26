const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  reserveVehicle,
} = require("../controllers/vehicleController");


router.post("/", createVehicle);
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);
router.post("/:id/reserve", reserveVehicle);

module.exports = router;