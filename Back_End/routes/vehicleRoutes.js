const express = require("express");
const {
  reserveVehicle,
  cancelReservation,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  createVehicle, // ✅ Import createVehicle function
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getAllVehicles); // ✅ Get All Vehicles
router.get("/:id", getVehicleById); // ✅ Get a Vehicle by ID
router.post("/", createVehicle); // ✅ Create Vehicle (Handled inside controller)
router.post("/reserve/:vehicleId", reserveVehicle);
router.post("/:vehicleId/cancel", cancelReservation); // ✅ Cancel a Reservation
router.delete("/:id", deleteVehicle); // ✅ Delete a Vehicle

module.exports = router;
