import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const s3 = new AWS.S3({
  endpoint: process.env.NCP_ENDPOINT,
  region: process.env.NCP_REGION,
  credentials: new AWS.Credentials({
    accessKeyId: process.env.NCP_ACCESS_KEY,
    secretAccessKey: process.env.NCP_SECRET_KEY,
  }),
});

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }
});

const uploadParams = {
  Bucket: process.env.NCP_BUCKET_NAME,
  Key: `${Date.now()}_${file.originalname}`, // 파일명 중복 방지를 위해 타임스탬프 추가
  Body: fs.createReadStream(file.path),
  ACL: 'public-read', // 공개 읽기 권한 설정
  ContentType: file.mimetype, // 파일 타입 설정
};

// S3에 파일 업로드
s3.upload(uploadParams, (err, data) => {
  // 로컬 파일 삭제
  fs.unlink(file.path, (unlinkErr) => {
    if (unlinkErr) {
      console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
    }
  });

  if (err) {
    console.error('파일 업로드 오류:', err);
    return res
      .status(500)
      .json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }

  // 업로드된 파일의 URL 반환
  res.status(200).json({ imageUrl: data.Location });
});

export default router;
