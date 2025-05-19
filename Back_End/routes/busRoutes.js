const express = require("express");
const router = express.Router();
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  getBusLocation,   
} = require("../controllers/busController");

router.post("/", createBus);                     
router.get("/", getAllBuses);                    
router.get("/:id", getBusById);                  
router.put("/:id", updateBus);                 
router.get("/:id/location", getBusLocation);
router.delete("/:id", deleteBus);                  

module.exports = router;
