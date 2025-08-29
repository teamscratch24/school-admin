
const EventModel = require("../Model/EventModel");
const GalleryModel = require("../Model/Gallery");
const { UploadImageToS3 } = require("../cloud/config");
const { nanoid } = require("nanoid");
const { textRegex, dateRegex, timeRegex } = require("../utils/Regex");


const CreateEvent = async (req, res) => {
  try {
    const { title, date, description, time } = req.body;

    if (!title || !date || !description || !time) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if(!textRegex(title) || !dateRegex(date) || !timeRegex(time) ){
      return res.status(400).json({msg:"Please Give valid inputs"})
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ msg: "Image file is required" });
    }
    const EventImage = req?.files?.image;

    if (!EventImage.mimetype.startsWith("image/")) {
      return res.status(400).json({ msg: "Invalid image format" });
    }

    if (EventImage.size > 5 * 1024 * 1024) {
      return res.status(400).json({ msg: "Image size exceeds 5MB" });
    }

 
    UploadImageToS3(EventImage)
    .then(async (cdnFileUrl) => {
    
        await EventModel.create({
          title,
          date: new Date(date),
          description,
          time,
          eventImage: cdnFileUrl,
        });
      })
      .then(() => {
        return res.status(201).json({ msg: "Event created successfully" });
      })
      .catch((error) => {
        res.status(500).json({ msg: "Internal server error" });
      });
  } catch (error) {
    
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

   await EventModel.findOneAndDelete({_id:eventId}),

    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getEvent = async (req, res) => {

  try {
    const events = await EventModel.find().sort({ date: -1 });
    if (!events || events.length === 0) {
      return res.status(404).json({ msg: "No events found" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const addGalleryImage = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ msg: "Event ID is required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ msg: "Image file is required" });
    }
    const galleryImage = req.files?.image;

    if (!galleryImage.mimetype.startsWith("image/")) {
      return res.status(400).json({ msg: "Invalid image format" });
    }

    if (galleryImage.size > 5 * 1024 * 1024) {
      return res.status(400).json({ msg: "Image size exceeds 5MB" });
    }

    const cdnFileUrl = await UploadImageToS3(galleryImage);
    const imageId = nanoid(8);

    const findGallery = await GalleryModel.findOne({eventId});
  
    if (!findGallery) {
      await GalleryModel.create({
        eventId,
        images: [{ id: imageId, url: cdnFileUrl }],
      });
      return res.status(200).json({ msg: "Gallery created successfully" });
    }

    await GalleryModel.findOneAndUpdate(
     {eventId},
      { $push: { images: { id: imageId, url: cdnFileUrl } } },
      { new: true }
    );

    res.status(200).json({ msg: "Gallery created successfully" });
  } catch (error) {
    console.error("Add gallery error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getGalleryWithEvent = async (req, res) => {
  try {
    let { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ msg: "Event ID is required" });
    }
    

    const result = await GalleryModel.findOne({ eventId }).select("-_id")
      .populate("eventId", "title date")
      .lean();



    if (!result) {
      return res.status(404).json({ msg: "Gallery not found" });
    }

    const gallery = {
      eventId: result?.eventId?._id,
      title: result?.eventId?.title,
      date: result?.eventId?.date,
      images: [...result?.images],
    };

    return res.status(200).json({value:gallery});
  } catch (error) {
    console.error("Get gallery error:", error.message );
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const randomImages = await GalleryModel.aggregate([
      { $unwind: "$images" },
      { $sample: { size: 8 } },
      { $project: { _id: 0, url: "$images.url" } },
    ]);

    return randomImages;
  } catch (error) {
    return res.status(500).json({ msg: "Internel serer error" });
  }
};

const removeGalleryImage = async (req, res) => {
  try {
    const { eventId, imageId } = req.body;

    if (!eventId || !imageId) {
      return res
        .status(400)
        .json({ msg: "Event ID and Image ID are required" });
    }

    const gallery = await GalleryModel.findOne({ eventId });

    if (!gallery) {
      return res.status(404).json({ msg: "Gallery not found" });
    }

    await GalleryModel.findOneAndUpdate(
      { eventId },
      { $pull: { images: { id: imageId } } },
      { new: true }
    );

    res.status(200).json({ msg: "Image removed successfully" });
  } catch (error) {
    console.error("Remove gallery image error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  CreateEvent,
  deleteEvent,
  getGalleryWithEvent,
  getGalleryImages,
  addGalleryImage,
  removeGalleryImage,
  getEvent,
};
