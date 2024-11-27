import { Storage } from "@google-cloud/storage";
import path from "path";

import { GOOGLE_CLOUD_BUCKET_NAME } from "../config";

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

export default { uploadGoogleCloud };
