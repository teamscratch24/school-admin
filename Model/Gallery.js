const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  eventId: {
    type: String,
    ref: 'Event',
    required: true
  },
  images: [{
    _id:false,
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true }   
  }]
});

const GalleryModel = mongoose.model('Gallery', gallerySchema);
module.exports = GalleryModel;