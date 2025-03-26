const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const verifyToken = require("../middleware/verifyToken"); //protected routes

//Public Routes
router.post("/register", vendorController.registerVendor);          
router.post("/login", vendorController.loginVendor);                
router.post("/forgot-password", vendorController.forgotPassword);   
router.post("/reset-password", vendorController.resetPassword);     

//Vendor Protected Route (Profile)
router.get("/profile", verifyToken, vendorController.getProfile);   

//Admin-Only Routes for Vendor Management
router.get("/", vendorController.getAllVendors);                   
router.get("/:id", vendorController.getVendorById);                 
router.put("/:id", vendorController.updateVendor);                  
router.delete("/:id", vendorController.deleteVendor);               

module.exports = router;
