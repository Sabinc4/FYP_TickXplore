const express = require("express");
const { getTouristAreas, addTouristArea } = require("../controllers/touristAreaController");

const router = express.Router();

router.get("/", getTouristAreas);
router.post("/", addTouristArea);

module.exports = router;
