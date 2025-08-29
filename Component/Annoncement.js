const express = require("express");
const router = express.Router();
const Announcement = require("../Model/Annoncement.js");
const AuthCheck = require("../Middlewere/AuthMiddle.js");


router.get("/", async (req, res) => {
    try {
        
        const announcements = await Announcement.find({},{message:1,_id:1}).sort({ createdAt: -1});
        if(announcements.length === 0){
            return res.status(200).json([]);
        }
        res.status(200).json(announcements);
    } catch (error) {
        console.log("Error fetching announcements:", error.message);  
        res.status(500).json({ msg: "Server Error" });  
    }
});

router.post("/add",AuthCheck, async (req, res) => {
  try {
    const { message } = req.body;    
    if (!message) {
      return res.status(400).json({ msg: " Message is required" });
    }

    await Announcement.create({ message });

    return res.status(201).json({ msg: "Announcement created" });
  } catch (error) {
 
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/delete",AuthCheck, async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ msg: " ID is required" });
    }

    await Announcement.findByIdAndDelete({ _id: id });

    return res.status(200).json({ msg: "Success" });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
