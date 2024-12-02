import express from 'express';
import imageUpload from '../controllers/imageController';

const router = express.Router();

// 아이바오마켓이 S3에 직접 파일을 업로드할 수 있도록 Presigned URL을 반환하는 엔드포인트
router.post('/upload', imageUpload);

export default router;
