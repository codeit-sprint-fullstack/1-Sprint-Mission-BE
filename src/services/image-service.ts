import { Storage } from "@google-cloud/storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

import { GOOGLE_CLOUD_BUCKET_NAME } from "../config";
import {
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} from "../config";

const storage = new Storage();

async function uploadGoogleCloud(
  file: Express.Multer.File
): Promise<{ url: string }> {
  const fileUrl = await new Promise<string>((resolve, reject) => {
    const blob = storage
      .bucket(GOOGLE_CLOUD_BUCKET_NAME)
      .file(`${Date.now()}${path.extname(file.originalname)}`);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("finish", () => {
      const url = `https://storage.googleapis.com/${GOOGLE_CLOUD_BUCKET_NAME}/${blob.name}`;
      resolve(url);
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.end(file.buffer);
  });

  return { url: fileUrl };
}

const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

async function uploadAWS(file: Express.Multer.File): Promise<{ url: string }> {
  const bucketName = AWS_S3_BUCKET_NAME;

  const uploadParams = {
    Bucket: bucketName,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3Client.send(new PutObjectCommand(uploadParams));
  const uploadedImageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

  return { url: uploadedImageUrl };
}

export default { uploadGoogleCloud, uploadAWS };
