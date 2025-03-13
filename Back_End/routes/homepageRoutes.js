const express = require("express");
const { getHomepageContent, updateHomepageContent } = require("../controllers/homepageController");

const router = express.Router();

// ✅ Get Homepage Content
router.get("/homepage", getHomepageContent);

// ✅ Update Homepage Content (Without Middleware)
router.put("/homepage", updateHomepageContent);

module.exports = router;
