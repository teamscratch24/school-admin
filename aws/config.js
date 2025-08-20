const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const bucketName = process.env.CLOUD_BUCKET_NAME

const s3Client = new S3Client({
  region: process.env.CLOUD_REGION,
  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY,
  },
});

const UploadImageToS3 = async (file,title) => {

  const param = {
    Bucket: bucketName,
    Key:`events/${file.name}`,
    Body: file?.data,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(param));
    const cdnFileUrl = `https://${process.env.CLOUD_BUCKET_NAME}.s3.${process.env.CLOUD_REGION}.amazonaws.com/${param.Key}`;
    return cdnFileUrl;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};




module.exports = { UploadImageToS3 };
