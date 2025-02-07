const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController"); // ✅ Ensure this file exists!

// ✅ Define Vendor Routes
router.post("/create", vendorController.createVendor);
router.get("/", vendorController.getAllVendors);
router.get("/:id", vendorController.getVendorById);
router.patch("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);

module.exports = router;
