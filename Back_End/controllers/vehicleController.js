const Vehicle = require("../models/Vehicle");
const multer = require("multer");

// ✅ Set up image storage for uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Add a New Vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { name, type, pricePerDay, vendorId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Vehicle image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const newVehicle = new Vehicle({ name, type, pricePerDay, image: imageUrl, vendorId });

    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added successfully!", vehicle: newVehicle });
  } catch (error) {
    console.error("❌ Error adding vehicle:", error);
    res.status(500).json({ message: "Error adding vehicle", error });
  }
};

// ✅ Get All Vehicles for a Vendor
exports.getVehicles = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vehicles = await Vehicle.find({ vendorId });

    if (!vehicles.length) {
      return res.status(404).json({ message: "No vehicles found for this vendor." });
    }

    res.json({ vehicles });
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles", error });
  }
};

// ✅ Toggle Vehicle Availability
exports.toggleVehicleAvailability = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.isAvailable = !vehicle.isAvailable;
    await vehicle.save();

    res.json({ message: `Vehicle ${vehicle.isAvailable ? "Available" : "Unavailable"} now` });
  } catch (error) {
    console.error("❌ Error updating availability:", error);
    res.status(500).json({ message: "Error updating vehicle availability", error });
  }
};

// ✅ Delete a Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting vehicle:", error);
    res.status(500).json({ message: "Error deleting vehicle", error });
  }
};

// ✅ Export Upload Middleware
module.exports.upload = upload;
