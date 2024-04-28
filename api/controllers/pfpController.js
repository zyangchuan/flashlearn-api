const { User } = require("../models");
const crypto = require('crypto');
const { NotFoundError } = require('../errors'); 
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl }  = require("@aws-sdk/s3-request-presigner");
const { StatusCodes } = require('http-status-codes');
const sharp = require('sharp');

// Rename file name to profilePictureController

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const addProfilepic = async (req, res) => {
    const fileName = crypto.randomBytes(32).toString('hex') + '.jpg'; // Add file extension

    const fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 320, width: 320, fit: "contain" })
      .toBuffer();
    
    const uploadParams = {
      Bucket: 'flashlearnimages',
      Key: fileName,
      Body: fileBuffer,
      ContentType: req.file.mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const user = await User.findOne({
      where: {
        id: req.user.id
      }
    });

    if (!user) throw new NotFoundError("User does not exist");


    // We can use null for users without a profile pic
    if (user.profile_picture != 0){
      await s3Client.send(new DeleteObjectCommand({
        Bucket: 'flashlearnimages',
        Key: user.profile_picture,
    }))
    
    user.profile_picture = fileName;
    await user.save();

    // use StatusCodes.OK
    res.status(200).json({ msg: 'Profile picture uploaded successfully', filename: fileName });
};}

const getProfilepic = async(req,res) =>{
  // const imageId = req.params.profile_picture
  // dont forget variable type
  pic_id = req.params.profile_picture
  imageurl = await getSignedUrl(
    s3Client, 
    new GetObjectCommand({
      Bucket: 'flashlearnimages',
      Key: pic_id
    }),
    { expiresIn: 60 }// 60 seconds
  )
  if (!imageurl) throw new NotFoundError('No images found')

  // Use StatusCodes.OK
  res.status(200).send(imageurl);
}
  
  

// eh dont leave so many blank lines leh

  

  

module.exports = {
  addProfilepic,
  getProfilepic
};