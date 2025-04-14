const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// Initialize Express App
const app = express();

// Middleware Configuration
app.use(cors());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, crossOriginEmbedderPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable File Upload Handling
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    responseOnLimit: "File size limit exceeded (Max: 5MB)",
  })
);

// Static File Serving for Uploaded Images
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// MongoDB Connection with Error Handling
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/tickxplore";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const busRoutes = require("./routes/busRoutes");
const userRoutes = require('./routes/userRoutes');
const homepageRoutes = require("./routes/homepageRoutes");
const touristAreaRoutes = require("./routes/touristAreaRoutes");
const paymentRoutes = require("./routes/payment");
const bookingRoutes = require("./routes/bookingRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const refundRoutes = require("./routes/refundRoutes");


// API Routes
app.use("/auth", authRoutes);
app.use("/admin", authRoutes);
app.use("/vendor", authRoutes);
app.use('/users', authRoutes);
app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/buses", busRoutes);
app.use("/api", homepageRoutes);
app.use("/api/tourist-areas", touristAreaRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", bookingRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/api", authRoutes);
app.use("/api/bookings", refundRoutes);


// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running!", timestamp: new Date() });
});

// Test Route to Check Image Serving
app.get("/test-image", (req, res) => {
  res.send(`<img src="http://localhost:3001/uploads/sample.jpg" alt="Test Image"/>`);
});

// 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.stack);
  res.status(500).json({ error: "An unexpected error occurred.", details: err.message });
});

// Graceful Shutdown Handling
const shutdown = async () => {
  console.log("\n Closing MongoDB Connection...");
  await mongoose.connection.close();
  console.log(" MongoDB Connection Closed. Server Shutting Down.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
