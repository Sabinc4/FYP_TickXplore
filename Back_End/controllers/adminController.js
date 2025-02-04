const mongoose = require("mongoose");
const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");
const VehicleModel = require("../models/Vehicle"); 

//FETCH USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "userId name email location role");
    res.json({ users });
  } catch (error) {
    console.error(" Error fetching users:", error);
    res.status(500).json({ message: " Error fetching users", error: error.message });
  }
};

// FETCH VENDORS
exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find({}, "vendorId vendorName email vendorLocation role isActive");
    res.json({ vendors });
  } catch (error) {
    console.error(" Error fetching vendors:", error);
    res.status(500).json({ message: " Error fetching vendors", error: error.message });
  }
};

// FETCH ADMINS
exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({}, "adminId name email location role");
    res.json({ admins });
  } catch (error) {
    console.error(" Error fetching admins:", error);
    res.status(500).json({ message: " Error fetching admins", error: error.message });
  }
};

// FETCH DASHBOARD STATS (Now Includes Vehicles)
exports.getStats = async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
    const vendorsCount = await VendorModel.countDocuments();
    const adminsCount = await AdminModel.countDocuments();
    const vehiclesCount = await VehicleModel.countDocuments();

    res.json({
      users: usersCount || 0,
      vendors: vendorsCount || 0,
      admins: adminsCount || 0,
      vehicles: vehiclesCount || 0, // Now includes actual vehicles count
    });
  } catch (error) {
    console.error(" Error fetching stats:", error);
    res.status(500).json({ message: " Error fetching stats", error: error.message });
  }
};

// TOGGLE VENDOR STATUS
exports.toggleVendorStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Vendor ID format" });
    }

    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.json({ message: `Vendor is now ${vendor.isActive ? "Active" : "Inactive"}` });
  } catch (error) {
    console.error(" Error updating vendor status:", error);
    res.status(500).json({ message: " Error updating vendor status", error: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(" Error deleting user:", error);
    res.status(500).json({ message: " Error deleting user", error: error.message });
  }
};

// DELETE VENDOR
exports.deleteVendor = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Vendor ID format" });
    }

    const vendor = await VendorModel.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error(" Error deleting vendor:", error);
    res.status(500).json({ message: " Error deleting vendor", error: error.message });
  }
};
