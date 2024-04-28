const { User } = require("../models");
const crypto = require('crypto');
const { NotFoundError, BadRequestError } = require('../errors'); 
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, NotFound } = require("@aws-sdk/client-s3");
const { getSignedUrl }  = require("@aws-sdk/s3-request-presigner");
const { StatusCodes } = require('http-status-codes');
const sharp = require('sharp');

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const updateProfilePicture = async (req, res) => {
    const fileName = crypto.randomBytes(32).toString('hex') + '.jpg';
    const fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 320, width: 320, fit: "contain" })
      .jpeg({quality:80})
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

    if (user.profile_picture != null){
      await s3Client.send(new DeleteObjectCommand({
        Bucket: 'flashlearnimages',
        Key: user.profile_picture,
    }))
    
    user.profile_picture = fileName;
    await user.save();

   
    res.status(StatusCodes.OK).json({ msg: 'Profile picture uploaded successfully', filename: fileName });
};}

const getProfilePicture = async(req,res) =>{
  const pic_id = req.params.profile_picture
  imageurl = await getSignedUrl(
    s3Client, 
    new GetObjectCommand({
      Bucket: 'flashlearnimages',
      Key: pic_id
    }),
    { expiresIn: 60 }// 60 seconds
  )
  if (!imageurl) throw new NotFoundError('No images found')

  
  res.status(StatusCodes.OK).send(imageurl);
}
  


module.exports = {
  updateProfilePicture,
  getProfilePicture
};