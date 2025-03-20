const express = require("express");
const {
  getUsers,
  getVendors,
  getAdmins,
  getAdminById, // ✅ Fetch single admin
  getStats,
  toggleVendorStatus,
  editUser,
  editVendor,
  deleteUser,
  deleteVendor,
} = require("../controllers/adminController");

const router = express.Router();

// ✅ User Routes
router.get("/get-users", getUsers);
router.put("/edit-user/:id", editUser);
router.delete("/delete-user/:id", deleteUser);

// ✅ Vendor Routes
router.get("/get-vendors", getVendors);
router.put("/edit-vendor/:id", editVendor);
router.put("/toggle-vendor/:id", toggleVendorStatus);
router.delete("/delete-vendor/:id", deleteVendor);

// ✅ Admin Routes
router.get("/get-admins", getAdmins);
router.get("/get-admin/:id", getAdminById); // ✅ Fix for fetching a single admin
router.get("/get-stats", getStats);

module.exports = router;
