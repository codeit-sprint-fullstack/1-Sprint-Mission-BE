"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// const s3 = new S3Client({
//   region: process.env.AWS_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_S3_SECRET_KEY,
//   },
// });
// const upload = multer({ dest: 'uploads/' });
// router.post('/', upload.array('image', 3), async (req, res) => {
//   const files = req.files;
//   if (!files || files.length === 0) {
//     return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
//   }
//   try {
//     const uploadPromises = files.map(async (file) => {
//       const uploadParams = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: `${Date.now()}_${file.originalname}`,
//         Body: fs.createReadStream(file.path),
//         ContentType: file.mimetype,
//         ServerSideEncryption: 'AES256',
//       };
//       const command = new PutObjectCommand(uploadParams);
//       await s3.send(command);
//       fs.unlink(file.path, (unlinkErr) => {
//         if (unlinkErr) {
//           console.error('로컬 파일 삭제 중 오류 발생:', unlinkErr);
//         }
//       });
//       return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`;
//     });
//     const uploadedImageUrls = await Promise.all(uploadPromises);
//     res.status(200).json({ imageUrls: uploadedImageUrls });
//   } catch (err) {
//     console.error('파일 업로드 오류:', err);
//     return res
//       .status(500)
//       .json({ message: '파일 업로드 중 오류가 발생했습니다.' });
//   }
// });
exports.default = router;
