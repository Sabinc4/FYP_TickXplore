const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// Define routes using controller methods
router.post("/create", busController.createBus);
router.get("/", busController.getAllBuses);
router.get("/:id", busController.getBusById);
router.put("/:id", busController.updateBus);
router.post("/book-seats", busController.bookSeats); // ✅ Fixed booking route
router.delete("/:id", busController.deleteBus);

module.exports = router;
