const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require("../controllers/busController");

const router = express.Router();

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API Endpoints
router.post("/", upload.single("image"), createBus); // Create Bus
router.get("/", getAllBuses); // Get All Buses
router.get("/:id", getBusById); // Get Single Bus by ID
router.put("/:id", upload.single("image"), updateBus); // Update Bus
router.delete("/:id", deleteBus); // Delete Bus

module.exports = router;