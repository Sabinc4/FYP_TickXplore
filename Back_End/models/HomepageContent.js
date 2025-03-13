const mongoose = require("mongoose");

const HomepageContentSchema = new mongoose.Schema({
  title: { type: String, default: "Explore Nepal with TickXplore" },
  backgroundImage: { type: String, required: true }, 
});

module.exports = mongoose.model("HomepageContent", HomepageContentSchema);
