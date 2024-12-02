"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
// AWS S3 설정
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
// 이미지 업로드 함수
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
        }
        const file = req.file;
        const fileName = `${uuidv4()}_${file.originalname}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        // S3에 업로드
        const data = yield s3.upload(params).promise();
        return res
            .status(200)
            .json({ message: '파일 업로드 성공', imageUrl: data.Location });
    }
    catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        return res.status(500).json({ message: '이미지를 업로드할 수 없습니다.' });
    }
});
exports.default = uploadImage;
