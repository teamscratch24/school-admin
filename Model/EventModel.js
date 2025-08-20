const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    time: { type: String, required: true },
    eventImage: { type: String },
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event", EventSchema);
module.exports = EventModel;
