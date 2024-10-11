import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('image', 3), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalname}`,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
        }
      });

      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`;
    });

    const uploadedImageUrls = await Promise.all(uploadPromises);

    res.status(200).json({ imageUrls: uploadedImageUrls });
  } catch (err) {
    console.error('파일 업로드 오류:', err);
    return res
      .status(500)
      .json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

export default router;
