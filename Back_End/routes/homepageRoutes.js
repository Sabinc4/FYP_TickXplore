const express = require("express");
const { getHomepageContent, updateHomepageContent } = require("../controllers/homepageController");

const router = express.Router();

router.get("/homepage", getHomepageContent);
router.put("/homepage", updateHomepageContent);

module.exports = router;
