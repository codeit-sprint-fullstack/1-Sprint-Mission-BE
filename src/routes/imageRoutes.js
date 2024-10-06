import express from "express";
import * as imageController from "../controllers/imageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  imageController.uploadImage
);

export default router;
