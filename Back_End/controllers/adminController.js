const mongoose = require("mongoose");
const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");
const VehicleModel = require("../models/Vehicle");
const BusModel = require("../models/Bus");

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

// ✅ FETCH VENDORS
exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find({}, "vendorId vendorName email vendorLocation role isActive");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    handleError(res, error, "fetching vendors");
  }
};

// ✅ FETCH ADMINS
exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({}, "adminId name email location role");
    res.status(200).json({ success: true, admins });
  } catch (error) {
    handleError(res, error, "fetching admins");
  }
};

// ✅ FETCH DASHBOARD STATS
exports.getStats = async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
    const vendorsCount = await VendorModel.countDocuments();
    const adminsCount = await AdminModel.countDocuments();
    const vehiclesCount = await VehicleModel.countDocuments();
    const busesCount = await BusModel.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        users: usersCount || 0,
        vendors: vendorsCount || 0,
        admins: adminsCount || 0,
        vehicles: vehiclesCount || 0,
        buses: busesCount || 0,
      },
    });
  } catch (error) {
    handleError(res, error, "fetching stats");
  }
};

// ✅ TOGGLE VENDOR STATUS
exports.toggleVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vendor ID format" });
    }

    const vendor = await VendorModel.findById(id);
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

// ✅ EDIT USER (Fixed)
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid User ID format" });
    }

    const { name, email } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "❌ User not found" });

    res.status(200).json({ message: "✅ User updated successfully", updatedUser });
  } catch (error) {
    handleError(res, error, "updating user");
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid User ID format" });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "❌ User not found" });

    res.status(200).json({ message: "✅ User deleted successfully", deletedUser });
  } catch (error) {
    handleError(res, error, "deleting user");
  }
};

// ✅ FETCH SINGLE ADMIN
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await AdminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "❌ Admin not found" });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ EDIT VENDOR (Fixed)
exports.editVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vendor ID format" });
    }

    const { vendorName } = req.body;
    if (!vendorName) {
      return res.status(400).json({ message: "⚠️ Vendor name is required" });
    }

    const updatedVendor = await VendorModel.findByIdAndUpdate(
      id,
      { vendorName },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) return res.status(404).json({ message: "❌ Vendor not found" });

    res.status(200).json({ message: "✅ Vendor updated successfully", updatedVendor });
  } catch (error) {
    console.error("❌ Error updating vendor:", error);
    res.status(500).json({ message: "❌ Error updating vendor", error: error.message });
  }
};


// ✅ DELETE VENDOR
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "⚠️ Invalid Vendor ID format" });
    }

    const deletedVendor = await VendorModel.findByIdAndDelete(id);
    if (!deletedVendor) return res.status(404).json({ message: "❌ Vendor not found" });

    res.status(200).json({ message: "✅ Vendor deleted successfully", deletedVendor });
  } catch (error) {
    handleError(res, error, "deleting vendor");
  }
};
