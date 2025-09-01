const mongoose = require("mongoose");

const LandingGallerySchema = new mongoose.Schema({
  images: [
    {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const LandingGalleryModel = mongoose.model("LandingGallery", LandingGallerySchema);

module.exports = LandingGalleryModel;
