"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// AWS S3 클라이언트 설정 (v3)
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// 파일 필터 설정 (이미지 파일 형식만 허용)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.test(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("이미지 파일 형식은 jpg, jpeg, png만 허용됩니다."));
    }
};
// S3 Storage 설정
const storage = (0, multer_s3_1.default)({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});
// Multer 설정
exports.imageUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 파일 크기 제한: 5MB
});
