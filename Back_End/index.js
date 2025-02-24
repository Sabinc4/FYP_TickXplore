const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

// ✅ Initialize Express App
const app = express();

// ✅ Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows cross-origin resource sharing
    crossOriginEmbedderPolicy: false, // Fix for CORS blocking
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ✅ CORS Configuration (Handles Multiple Origins)
const allowedOrigins = ["http://localhost:5173"]; // Add more origins if needed
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS not allowed for this origin"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ✅ Serve Static Files (Ensure 'uploads/' Exists)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// ✅ MongoDB Connection with Error Handling
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/tickxplore";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const busRoutes = require("./routes/busRoutes");
const userRoutes = require("./routes/userRoutes");


// ✅ API Routes (Grouped for Clarity)
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/users", userRoutes);
app.use("/booking", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/buses", busRoutes);

// ✅ Test Route to Check Image Serving
app.get("/test-image", (req, res) => {
  res.send(`<img src="http://localhost:3001/uploads/sample.jpg" alt="Test Image"/>`);
});

// ✅ 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("\n🔄 Closing MongoDB Connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB Connection Closed. Server Shutting Down.");
  process.exit(0);
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
