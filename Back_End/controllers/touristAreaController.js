const TouristArea = require("../models/TouristArea");

//Fetch all tourist areas
exports.getTouristAreas = async (req, res) => {
  try {
    const areas = await TouristArea.find();
    res.status(200).json(areas);
  } catch (error) {
    console.error("Error fetching tourist areas:", error);
    res.status(500).json({ message: "Failed to fetch tourist areas." });
  }
};

//Add a new tourist area
exports.addTouristArea = async (req, res) => {
  try {
    const { title, description, image, price, rating } = req.body;

    if (!title || !description || !image || !price || rating === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newArea = new TouristArea({ title, description, image, price, rating });
    await newArea.save();

    res.status(201).json({ message: "Tourist area added successfully!", area: newArea });
  } catch (error) {
    console.error(" Error adding tourist area:", error);
    res.status(500).json({ message: "Failed to add tourist area." });
  }
};
