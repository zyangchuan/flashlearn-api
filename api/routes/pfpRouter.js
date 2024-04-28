const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');
const multer = require('multer');
const upload = multer();

const {
    addProfilepic,
    getProfilepic,
} = require("../controllers/pfpController")

// add authorize user middleware to add profile picture route
// use updateProfilePicture for the controller name and use patch method
router.route('/')
  .post(upload.single('file'), authenticateUser, addProfilepic)

router.route('/:profile_picture')
  .get(authenticateUser,getProfilepic)

module.exports = router;

