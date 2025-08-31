const { get } = require('mongoose');
const { CreateEvent, getGalleryWithEventId, addGalleryImage, removeGalleryImage, getEvent, getGalleryImages, deleteEvent } = require('../Component/EventCard');
const AuthCheck = require('../Middlewere/AuthMiddle');

const router = require('express').Router();


router.get("/", getEvent);
router.get("/gallery/images",getGalleryImages)
router.post("/gallerywithid",getGalleryWithEventId)
router.post("/create",AuthCheck, CreateEvent);
router.post("/delete", AuthCheck,deleteEvent);
router.post("/gallery/add",AuthCheck,addGalleryImage)
router.post("/gallery/remove",AuthCheck,removeGalleryImage)


module.exports = router;