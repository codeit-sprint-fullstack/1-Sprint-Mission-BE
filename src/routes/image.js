import express from "express";
import multer from "multer";

import { validateAccessToken } from "../middlewares/auth.js";

const upload = multer({ dest: "uploads/" });
const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  validateAccessToken,
  upload.array("images", 3),
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      const err = { message: `Fail upload images` };
      return next(err);
    }

    const fileUrls = req.files.map((file) => ({
      filename: file.filename,
      images: `http://localhost:3000/uploads/${file.filename}`,
    }));

    return res.status(200).send({ url: fileUrls });
  }
);

export default imageRouter;
