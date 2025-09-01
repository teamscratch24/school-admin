const express = require("express");
const { UploadImageToS3, getSignedUrlFromS3 } = require("../cloud/config");
const { nanoid } = require("nanoid");
const LandingGalleryModel = require("../Model/LandingGallery");
const AuthCheck = require("../Middlewere/AuthMiddle");
const router = express.Router();

router.post("/add", AuthCheck, async (req, res) => {
  try {
   
    if (!req.files || !req.files.image) {
      return res.status(400).json({ msg: "Image file is required" });
    }
    const galleryImage = req.files?.image;

    if (!galleryImage.mimetype.startsWith("image/")) {
      return res.status(400).json({ msg: "Invalid image format" });
    }

    if (galleryImage.size > 10 * 1024 * 1024) {
      return res.status(400).json({ msg: "Image size exceeds 5MB" });
    }

    const cdnFileUrl = await UploadImageToS3(galleryImage);
    const imageId = nanoid(8);

    const findGallery = await LandingGalleryModel.findOne({})
  
    if (!findGallery) {
      await LandingGalleryModel.create({
        images: [{ id: imageId, url: cdnFileUrl }],
      });
      return res.status(200).json({ msg: "Gallery created successfully" });
    }

    await LandingGalleryModel.findOneAndUpdate(
     {_id:findGallery._id},
      { $push: { images: { id: imageId, url: cdnFileUrl } } },
      { new: true }
    );

    res.status(200).json({ msg: "Gallery created successfully" });
  } catch (error) {
    console.error("Add gallery error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
})

router.get("/all", async (req, res) => {
  try {

    const randomImages = await LandingGalleryModel.aggregate([
  { $unwind: "$images" },
  {
    $project: {
      _id: 0,               
      id: "$images.id",     
      url: "$images.url"   
    }
  }
]);

 const urls = await Promise.all(
      randomImages.map(async (key) => {
        const url = await getSignedUrlFromS3(key?.url);
        return { ...key, url };
      })
    );

  
    return res.status(200).json({ images: urls });

  } catch (error) {
    return res.status(500).json({ msg: "Internel serer error" });
  }
})

router.post("/remove",AuthCheck, async (req, res) => {
  try {
    const { imageId } = req.body;

    if (!imageId) {
      return res
        .status(400)
        .json({ msg: "Image ID is required" });
    }

    const gallery = await LandingGalleryModel.findOne({});

    if (!gallery) {
      return res.status(404).json({ msg: "Gallery not found" });
    }

    await LandingGalleryModel.findOneAndUpdate(
      {_id:gallery._id},    
      { $pull: { images: { id: imageId } } },
      { new: true }
    );      

    res.status(200).json({ msg: "Image removed successfully" });
  } catch (error) {
    console.error("Remove gallery image error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router ;