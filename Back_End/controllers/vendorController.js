const mongoose = require("mongoose"); // Ensure mongoose is required
const Vendor = require("../models/Vendor");

// ✅ Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "-password"); // Exclude sensitive fields
    return res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get Vendor By ID (Handles ObjectId and Auto-Incremented vendorId)
exports.getVendorById = async (req, res) => {
  try {
    let vendor;

    // Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      vendor = await Vendor.findById(req.params.id);
    } else {
      // If not a MongoDB ObjectId, check by vendorId (auto-incremented field)
      vendor = await Vendor.findOne({ vendorId: req.params.id });
    }

    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error("❌ Error fetching vendor by ID:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Create a New Vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const newVendor = new Vendor({
      name,
      email,
      phone,
      address,
    });

    const savedVendor = await newVendor.save();
    return res.status(201).json({ success: true, message: "Vendor created successfully", vendor: savedVendor });
  } catch (error) {
    console.error("❌ Error creating vendor:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update an Existing Vendor (Handles ObjectId and vendorId)
exports.updateVendor = async (req, res) => {
  try {
    let vendor;

    // Check if ID is valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      vendor = await Vendor.findById(req.params.id);
    } else {
      // Otherwise, search by auto-incremented vendorId
      vendor = await Vendor.findOne({ vendorId: req.params.id });
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Update fields if provided
    Object.assign(vendor, req.body);

    const updatedVendor = await vendor.save();
    return res.status(200).json({ success: true, message: "Vendor updated successfully", vendor: updatedVendor });
  } catch (error) {
    console.error("❌ Error updating vendor:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a Vendor (Handles ObjectId and vendorId)
exports.deleteVendor = async (req, res) => {
  try {
    let vendor;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      vendor = await Vendor.findByIdAndDelete(req.params.id);
    } else {
      vendor = await Vendor.findOneAndDelete({ vendorId: req.params.id });
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({ success: true, message: "✅ Vendor deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting vendor:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
