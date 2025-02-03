const express = require("express");
const {
  getUsers,
  getVendors,
  getAdmins,
  getStats,
  toggleVendorStatus,
  deleteUser,
  deleteVendor
} = require("../controllers/adminController");

const router = express.Router();

router.get("/get-users", getUsers);
router.get("/get-vendors", getVendors);
router.get("/get-admins", getAdmins);
router.get("/get-stats", getStats);
router.put("/toggle-vendor/:id", toggleVendorStatus);
router.delete("/delete-user/:id", deleteUser);
router.delete("/delete-vendor/:id", deleteVendor);

module.exports = router;
