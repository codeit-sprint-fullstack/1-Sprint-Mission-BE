import { NextFunction, Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3"; // S3Client를 가져옵니다
import multer from "multer";
import { Upload } from "@aws-sdk/lib-storage"; // Upload을 가져옵니다
import path from "path";
import { CustomError } from "./error-handler";
import {
  AWS_ACCESS_KEY_ID,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../config/env";

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// 파일 확장자 허용 목록
const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".svg"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB 제한
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    if (allowedExtensions.includes(extension)) {
      cb(null, true); // 허용된 확장자
    } else {
      const error: CustomError = new Error("지원하지 않는 확장자입니다");
      error.status = 415;
      cb(error);
    }
  },
});

// 이미지 업로드 핸들러
const imageUploader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 파일이 없을 경우 오류 처리
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    req.body.imageUrls = [];
    return next();
  }

  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
      };

      // S3에 업로드
      await new Upload({
        client: s3Client,
        params: uploadParams,
      }).done();

      const imageUrl = `https://${uploadParams.Bucket}.s3.${AWS_S3_REGION}.amazonaws.com/${fileName}`;
      imageUrls.push(imageUrl);
    }

    req.body.imageUrls = imageUrls; // 업로드된 이미지 URL 배열을 body에 추가
    return next();
  } catch (error) {
    return next(error);
  }
};

// multer의 미들웨어와 함께 사용
const multerMiddleware = upload.array("images", 3);

export { imageUploader, multerMiddleware };
