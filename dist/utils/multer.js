"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../uploads');
        // 업로드 폴더가 존재하지 않으면 생성
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        cb(null, false);
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 최대 파일 크기 5MB 제한
});
exports.default = upload;
