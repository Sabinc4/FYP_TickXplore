const express = require("express");
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require("../controllers/busController");

const router = express.Router();

// ✅ Create Bus (Handles File Uploads via `express-fileupload`)
router.post("/", createBus);

// ✅ Get All Buses (Handles Homepage, Admin, and Vendor Requests)
router.get("/", getAllBuses);

// ✅ Get a Single Bus by ID
router.get("/:id", getBusById);

// ✅ Update Bus (Handles File Uploads via `express-fileupload`)
router.put("/:id", updateBus);

// ✅ Delete a Bus
router.delete("/:id", deleteBus);

module.exports = router;