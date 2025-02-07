const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ API Endpoints
router.post("/", upload.single("image"), createVehicle); // Create Vehicle
router.get("/", getAllVehicles); // Get All Vehicles
router.get("/:id", getVehicleById); // Get Single Vehicle by ID
router.put("/:id", upload.single("image"), updateVehicle); // Update Vehicle
router.delete("/:id", deleteVehicle); // Delete Vehicle

module.exports = router;
