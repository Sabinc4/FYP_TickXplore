const express = require("express");
const router = express.Router();
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  updateBusLocation,   
} = require("../controllers/busController");

router.post("/", createBus);                     
router.get("/", getAllBuses);                    
router.get("/:id", getBusById);                  
router.put("/:id", updateBus);                 
router.put("/:id/update-location", updateBusLocation); 
router.delete("/:id", deleteBus);                  

module.exports = router;
