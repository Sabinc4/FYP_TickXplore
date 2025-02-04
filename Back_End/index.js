require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

//Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

//Middleware
app.use(express.json()); // Parse JSON requests
app.use(helmet()); // Secure HTTP headers

//Configure CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://your-production-url.com"], 
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev")); 

// Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection with Auto-Retry
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");

    // Listen for DB disconnection & attempt reconnection
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Reconnecting...");
      setTimeout(connectDB, 5000);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000); // Retry after 5 sec
  }
};

connectDB();

//API Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/booking", bookingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Graceful Shutdown Handling
const shutdown = () => {
  console.log(" Server shutting down...");
  mongoose.connection.close(() => {
    console.log(" MongoDB connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

//Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
