const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');
const multer = require('multer');
const upload = multer();

const {
    addProfilepic,
    getProfilepic,
} = require("../controllers/pfpController")

router.route('/')
  .post(upload.single('file'),authenticateUser,addProfilepic)

router.route('/:profile_picture')
  .get(authenticateUser,getProfilepic)

module.exports = router;

