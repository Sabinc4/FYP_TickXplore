const Vendor = require("../models/Vendor");

// ✅ Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const newVendor = new Vendor({ name, email, phone, address });
    await newVendor.save();

    res.status(201).json({ success: true, message: "Vendor created successfully", vendor: newVendor });
  } catch (error) {
    console.error("❌ Error creating vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("❌ Error fetching vendors:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get Single Vendor
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error("❌ Error fetching vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, message: "Vendor updated successfully", vendor: updatedVendor });
  } catch (error) {
    console.error("❌ Error updating vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
