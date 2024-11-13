import express from "express";
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import path from "path";

import { createCustomError } from "../utils/error.js";

const bucketName = "image-unload-codeit-test";
const storage = new Storage();
const upload = multer({ storage: multer.memoryStorage() });

const imageRouter = express.Router();

async function authenticateImplicitWithAdc() {
  const storage = new Storage({
    projectId: "imageupload-438323",
  });
  const [buckets] = await storage.getBuckets();
  console.log("Buckets:");

  for (const bucket of buckets) {
    console.log(`- ${bucket.name}`);
  }

  console.log("Listed all storage buckets.");
}

imageRouter.post(
  "/upload",
  validateAccessToken,
  upload.array("images", 3),
  async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(
        createCustomError({ status: 500, message: `Fail upload images` })
      );
    }

    authenticateImplicitWithAdc();

    try {
      const fileUrls = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const blob = storage
              .bucket(bucketName)
              .file(`${Date.now()}${path.extname(file.originalname)}`);
            const blobStream = blob.createWriteStream({
              resumable: false,
              contentType: file.mimetype,
            });

            blobStream.on("finish", () => {
              const url = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
              resolve(url);
            });

            blobStream.on("error", (err) => {
              reject(err);
            });

            blobStream.end(file.buffer);
          });
        })
      );

      return res.status(200).send({ url: fileUrls });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
);

export default imageRouter;
