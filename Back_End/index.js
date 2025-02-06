const express = require("express");
const axios = require("axios");
const multer = require("multer");
require("dotenv").config(); // Load environment variables

const router = express.Router();
const IMGBB_API_KEY = process.env.IMGBB_API_KEY; // Use API key from .env

if (!IMGBB_API_KEY) {
  console.error("❌ ERROR: Missing IMGBB API Key! Add it to your .env file.");
}

// ✅ Configure Multer for Image Uploads (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ API Route to Upload Images to imgbb
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    console.log("✅ File received:", req.file.originalname); // Debugging

    // Convert Image to Base64
    const base64Image = req.file.buffer.toString("base64");

    // Upload Image to imgbb
    const response = await axios.post("https://api.imgbb.com/1/upload", null, {
      params: {
        key: IMGBB_API_KEY,
        image: base64Image,
      },
    });

    console.log("✅ Image uploaded successfully:", response.data.data.url);

    return res.status(200).json({ success: true, url: response.data.data.url });
  } catch (error) {
    console.error("❌ Image Upload Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

module.exports = router;
