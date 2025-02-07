const mongoose = require("mongoose");
const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");
const VehicleModel = require("../models/Vehicle");
const BusModel = require("../models/Bus"); // Ensure BusModel is imported

// ✅ Error Handler Function
const handleError = (res, error, action) => {
  console.error(`❌ Error ${action}:`, error);
  res.status(500).json({ message: `❌ Error ${action}`, error: error.message });
};

// ✅ FETCH USERS (Only Required Fields)
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "userId name email location role");
    res.status(200).json({ success: true, users });
  } catch (error) {
    handleError(res, error, "fetching users");
  }
};

// ✅ FETCH VENDORS (Only Required Fields)
exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find({}, "vendorId vendorName email vendorLocation role isActive");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    handleError(res, error, "fetching vendors");
  }
};

// ✅ FETCH ADMINS (Only Required Fields)
exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({}, "adminId name email location role");
    res.status(200).json({ success: true, admins });
  } catch (error) {
    handleError(res, error, "fetching admins");
  }
};

// ✅ FETCH DASHBOARD STATS (Now Includes Buses)
exports.getStats = async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
    const vendorsCount = await VendorModel.countDocuments();
    const adminsCount = await AdminModel.countDocuments();
    const vehiclesCount = await VehicleModel.countDocuments();
    const busesCount = await BusModel.countDocuments(); // Added Buses Count

    res.status(200).json({
      success: true,
      stats: {
        users: usersCount || 0,
        vendors: vendorsCount || 0,
        admins: adminsCount || 0,
        vehicles: vehiclesCount || 0,
        buses: busesCount || 0, // Included buses in stats
      },
    });
  } catch (error) {
    handleError(res, error, "fetching stats");
  }
};

// ✅ TOGGLE VENDOR STATUS
exports.toggleVendorStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vendor ID format" });
    }

    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "❌ Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `✅ Vendor is now ${vendor.isActive ? "Active" : "Inactive"}`,
      vendor: { vendorId: vendor.vendorId, vendorName: vendor.vendorName, isActive: vendor.isActive },
    });
  } catch (error) {
    handleError(res, error, "updating vendor status");
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid User ID format" });
    }

    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    res.status(200).json({ success: true, message: "✅ User deleted successfully", deletedUser: user });
  } catch (error) {
    handleError(res, error, "deleting user");
  }
};

// ✅ DELETE VENDOR
exports.deleteVendor = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vendor ID format" });
    }

    const vendor = await VendorModel.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "❌ Vendor not found" });

    res.status(200).json({ success: true, message: "✅ Vendor deleted successfully", deletedVendor: vendor });
  } catch (error) {
    handleError(res, error, "deleting vendor");
  }
};
