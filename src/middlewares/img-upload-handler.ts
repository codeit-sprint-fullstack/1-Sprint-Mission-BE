import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    const error = new Error("이미지 파일만 업로드 가능합니다.");
    cb(error as any, false);
  }
};

const imgUploadHandler = multer({
  dest: "uploads/",
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).array("images", 3);

export default imgUploadHandler;
