const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security Middleware (Fixed Helmet Configuration)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // ✅ Allows cross-origin resource sharing
    crossOriginEmbedderPolicy: false, // ✅ Fix for CORS blocking
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ✅ CORS Configuration (Fully Allow Frontend URL)
const corsOptions = {
  origin: ["http://localhost:5174"], // ✅ Allow only frontend domain
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ Added PUT and OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ Allow credentials (if needed)
};
app.use(cors(corsOptions));

// ✅ Handle Preflight Requests for CORS (Important for PUT Requests)
app.options("*", cors(corsOptions));

// ✅ Serve Static Files (Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Ensure images are accessible

// ✅ MongoDB Connection with Improved Error Handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if connection fails
  });

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const busRoutes = require("./routes/busRoutes");

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/booking", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/buses", busRoutes);

// ✅ Test Route to Check Image Serving
app.get("/test-image", (req, res) => {
  res.send(`<img src="http://localhost:3001/uploads/sample.jpg" alt="Test Image"/>`);
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
