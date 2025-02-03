const UserModel = require("../models/User");
const VendorModel = require("../models/Vendor");
const AdminModel = require("../models/Admin");

// FETCH USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "userId name email location role");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching users", error });
  }
};

// FETCH VENDORS
exports.getVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find({}, "vendorId vendorName email vendorLocation role isActive");
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching vendors", error });
  }
};

// FETCH ADMINS
exports.getAdmins = async (req, res) => {
  try {
    const admins = await AdminModel.find({}, "adminId name email location role");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching admins", error });
  }
};

// FETCH DASHBOARD STATS
exports.getStats = async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
    const vendorsCount = await VendorModel.countDocuments();
    const adminsCount = await AdminModel.countDocuments();

    res.json({
      users: usersCount || 0,
      vendors: vendorsCount || 0,
      admins: adminsCount || 0,
      buses: 0,
      vehicles: 0,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching stats", error });
  }
};

// TOGGLE VENDOR STATUS
exports.toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.json({ message: `Vendor is now ${vendor.isActive ? "Active" : "Inactive"}` });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating vendor status", error });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};

// DELETE VENDOR
exports.deleteVendor = async (req, res) => {
  await VendorModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Vendor deleted successfully" });
};
