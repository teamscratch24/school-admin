const { S3Client, PutObjectCommand, GetObjectCommand  } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require( "@aws-sdk/s3-request-presigner");
require("dotenv").config();


const bucketName = process.env.CLOUD_BUCKET_NAME
const accountId = process.env.CLOUDACCOUNTID

const s3Client = new S3Client({
  region: process.env.CLOUD_REGION,
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY,
  },
});


const UploadImageToS3 = async (file) => {

  const param = {
    Bucket: bucketName,
    Key: `events/${file.name}`,
    Body: file?.data,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(param));
    // const cdnFileUrl = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${param.Key}`;
    const cdnFileUrl = `${param.Key}`;
    return cdnFileUrl;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};

const getSignedUrlFromS3 = async (key) => {
  try {
    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 60 * 10 });
    return signedUrl; 
  } catch (error) {
    console.error("Error getting signed URL:", error.message);
    
  }
}





module.exports = { UploadImageToS3,getSignedUrlFromS3 };
