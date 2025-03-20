const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");

// ✅ Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

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
    const vendorId = req.params.id;

    // ✅ Ensure ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // ✅ Ensure full vendor data is sent
    res.status(200).json({
      success: true,
      vendor: {
        _id: vendor._id,
        name: vendor.vendorName, // ✅ Match database field
        email: vendor.email,
        location: vendor.vendorLocation, // ✅ Match database field
        role: vendor.role
      }
    });
  } catch (error) {
    console.error("❌ Error fetching vendor:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }
    
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Vendor ID format" });
    }
    
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