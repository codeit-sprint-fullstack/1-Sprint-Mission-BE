import express from 'express';
import multer from 'multer';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
dotenv.config();

const router = express.Router();

// S3 클라이언트 생성
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }

  // S3 업로드 파라미터 설정
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 버킷 이름
    Key: `${Date.now()}_${file.originalname}`, // 파일명 중복 방지를 위해 타임스탬프 추가
    Body: fs.createReadStream(file.path),
    ACL: 'public-read', // 공개 읽기 권한 설정
    ContentType: file.mimetype, // 파일 타입 설정
  };

  try {
    // S3에 파일 업로드
    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);

    // 로컬 파일 삭제
    fs.unlink(file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
      }
    });

    // 업로드된 파일의 URL 반환
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`;
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error('파일 업로드 오류:', err);
    // 로컬 파일 삭제
    fs.unlink(file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
      }
    });
    return res
      .status(500)
      .json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

export default router;
