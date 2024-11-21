import express from 'express';
import upload from '../utils/multer';
import imageUpload from '../controllers/imageController';

const router = express.Router();

router.post('/upload', upload.single('image'), imageUpload);

export default router;
