const express = require("express");
const multer = require("multer");
const path = require("path");
const busController = require("../controllers/busController");

const router = express.Router();

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ Define Routes
router.post("/", upload.single("image"), busController.createBus); 
router.get("/", busController.getAllBuses);                         
router.get("/:id", busController.getBusById);                       
router.put("/:id", upload.single("image"), busController.updateBus); 
router.delete("/:id", busController.deleteBus);                     

module.exports = router;
