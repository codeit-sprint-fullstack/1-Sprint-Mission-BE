import multer from "multer";
import path from "path";
import fs from "fs";

// 이미지 저장 경로 설정
const UPLOAD_DIR = path.join(process.cwd(), "uploads/");

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 이미지 저장 경로 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // 업로드 경로 설정
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// 이미지 파일의 유형 검증 (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일 형식은 jpg, jpeg, png만 허용됩니다."));
  }
};

// multer 설정
export const imageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 최대 파일 크기 5MB 제한
});
