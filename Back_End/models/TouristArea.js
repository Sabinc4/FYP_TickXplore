const mongoose = require("mongoose");

const TouristAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL to the image
  price: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = mongoose.model("TouristArea", TouristAreaSchema);
