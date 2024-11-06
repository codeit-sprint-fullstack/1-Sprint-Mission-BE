import express, { Request, Response } from "express";
import upload from "../utils/multer";
import imageUpload from "../controllers/imageController";

const router = express.Router();

// 이미지 업로드
router.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  imageUpload(req as Request, res);
});

export default router;
