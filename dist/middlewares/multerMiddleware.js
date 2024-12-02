import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { CustomError_Class } from '../utils/error.js';
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'photo-diary',
        key: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('허용되지 않는 파일 형식입니다');
            if (error instanceof CustomError_Class) {
                error.code = 'INCORRECT_FILETYPE';
                return cb(error, false);
            }
        }
        else {
            cb(null, true);
        }
    },
});
export default upload;
