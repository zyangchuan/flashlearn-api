const { User } = require("../models");
const crypto = require('crypto');
const { NotFoundError } = require('../errors'); 
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
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
    if (!user){
      throw new NotFoundError("User does not exist")
    }

    if (user.profile_picture != 0){
      await s3Client.send(new DeleteObjectCommand({
        Bucket: 'flashlearnimages',
        Key: user.profile_picture,
    }))
    
    user.profile_picture = fileName;
    await user.save();
    res.status(200).json({ message: 'Profile picture uploaded successfully', filename:fileName });

};}

const getProfilepic = async(req,res) =>{
  pic_id = req.query.profile_picture
  imageurl = await getSignedUrl(
    s3Client, 
    new GetObjectCommand({
      Bucket: 'flashlearnimages',
      Key: pic_id
    }),
    { expiresIn: 60 }// 60 seconds
  )
  if (!imageurl){
    throw new NotFoundError('No images found')
  }
  res.status(200).send(imageurl);
}
  
  



  

  

module.exports = {
  addProfilepic,
  getProfilepic
};