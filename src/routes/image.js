import express from "express";
import multer from "multer";

import { createCustomError } from "../lib/error.js";
import { validateAccessToken } from "../middlewares/auth.js";

const upload = multer({ dest: "uploads/" });
const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  validateAccessToken,
  upload.array("images", 3),
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(
        createCustomError({ status: 500, message: `Fail upload images` })
      );
    }

    const fileUrls = req.files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    );

    return res.status(200).send({ url: fileUrls });
  }
);

export default imageRouter;
