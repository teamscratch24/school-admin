const { CreateEvent, getGalleryWithEvent, addGalleryImage, removeGalleryImage, getEvent, getGalleryImages, deleteEvent } = require('../Component/EventCard');
const AuthCheck = require('../Middlewere/AuthMiddle');

const router = require('express').Router();


router.get("/", getEvent);
router.post("/gallerywithid",getGalleryWithEvent)
router.post("/create",AuthCheck, CreateEvent);
router.post("/delete", AuthCheck,deleteEvent);
router.post("/gallery/add",AuthCheck,addGalleryImage)
router.post("/gallery/remove",AuthCheck,removeGalleryImage)


module.exports = router;