const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authentication');
const { BadRequestError } = require('../errors'); 
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestError('Invalid file format. Only PNG, JPG, and JPEG files are allowed.'));
    }
    cb(null, true);
}
})

const {
    updateProfilepic,
    getProfilepic,
} = require("../controllers/profilePictureController")

const handleFileSizeLimitExceeded = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') throw new BadRequestError('Image size cannot be larger than 5MB')
  next(err);
};

router.route('/')
  .patch(upload.single('file'), handleFileSizeLimitExceeded, authenticateUser, updateProfilepic)


router.route('/:profile_picture')
  .get(authenticateUser,getProfilepic)

module.exports = router;

