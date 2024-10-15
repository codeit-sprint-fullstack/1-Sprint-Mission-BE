import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// AWS S3 클라이언트 설정 (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 파일 필터 설정 (이미지 파일 형식만 허용)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일 형식은 jpg, jpeg, png만 허용됩니다."));
  }
};

// S3 Storage 설정
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// Multer 설정
export const imageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 파일 크기 제한: 5MB
});
