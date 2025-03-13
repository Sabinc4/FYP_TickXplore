const fs = require("fs");
const path = require("path");
const HomepageContent = require("../models/HomepageContent");

// ✅ Get Homepage Content
exports.getHomepageContent = async (req, res) => {
  try {
    const homepageContent = await HomepageContent.findOne();
    if (!homepageContent) {
      return res.status(404).json({ message: "Homepage content not found" });
    }
    res.status(200).json(homepageContent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching homepage content", error });
  }
};

// ✅ Update Homepage Content with File Upload
exports.updateHomepageContent = async (req, res) => {
    try {
      console.log("Received request:", req.body);
      console.log("Received files:", req.files); // Debugging line
  
      if (!req.files || !req.files.backgroundImage) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      let imageFile = req.files.backgroundImage;
      let uploadPath = path.join(__dirname, "../uploads/", imageFile.name);
  
      imageFile.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({ message: "File upload failed", error: err });
        }
  
        const backgroundImage = `/uploads/${imageFile.name}`;
  
        const updatedContent = await HomepageContent.findOneAndUpdate(
          {},
          { title: req.body.title, backgroundImage },
          { new: true, upsert: true }
        );
  
        res.status(200).json(updatedContent);
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error updating homepage content", error });
    }
  };
  