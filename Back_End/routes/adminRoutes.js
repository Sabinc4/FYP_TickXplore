const express = require("express");
const mongoose = require("mongoose");
const {
  getUsers,
  getVendors,
  getAdmins,
  getStats,
  toggleVendorStatus,
  deleteUser,
  deleteVendor,
} = require("../controllers/adminController");

const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "⚠️ Invalid ID format" });
  }
  next();
};

// ✅ Routes
router.get("/get-users", getUsers);
router.get("/get-vendors", getVendors);
router.get("/get-admins", getAdmins);
router.get("/get-stats", getStats);
router.put("/toggle-vendor/:id", validateObjectId, toggleVendorStatus); // 🔄 Changed to PUT
router.delete("/delete-user/:id", validateObjectId, deleteUser);
router.delete("/delete-vendor/:id", validateObjectId, deleteVendor);

module.exports = router;
