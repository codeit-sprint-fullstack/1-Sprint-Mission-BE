import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

router.post('/', upload.array('image', 3), async (req, res) => {
  const files = req.file;

  if (!files) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }

  try {
    // 모든 파일을 S3에 업로드하고 URL을 배열로 저장
    const uploadPromises = files.map(async (file) => {
      // S3 업로드 파라미터 설정
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 버킷 이름
        Key: `${Date.now()}_${file.originalname}`, // 파일명 중복 방지를 위해 타임스탬프 추가
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype, // 파일 타입 설정
        ServerSideEncryption: 'AES256', // SSE-S3 암호화 설정
      };

      // S3에 파일 업로드
      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      // 로컬 파일 삭제
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
        }
      });

      // 업로드된 파일의 URL 반환
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`;
    });

    // 모든 파일 업로드가 완료될 때까지 대기
    const uploadedImageUrls = await Promise.all(uploadPromises);

    // 업로드된 파일의 URL 배열을 클라이언트에 응답으로 반환
    res.status(200).json({ imageUrls: uploadedImageUrls });
  } catch (err) {
    console.error('파일 업로드 오류:', err);
    return res
      .status(500)
      .json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

export default router;
