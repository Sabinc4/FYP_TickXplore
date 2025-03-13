const express = require("express");
const { getTouristAreas, addTouristArea } = require("../controllers/touristAreaController");

const router = express.Router();

// ✅ Get all tourist areas
router.get("/", getTouristAreas);

// ✅ Add a new tourist area
router.post("/", addTouristArea);

module.exports = router;
