import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = 'uploads/';

// 디렉토리 존재 확인 및 생성
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// 저장할 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름을 현재 시간으로 설정
  },
});

// multer 미들웨어 설정
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('허용되지 않는 파일 형식입니다');
      error.code = 'INCORRECT_FILETYPE';
      return cb(error, false);
    } else {
      cb(null, true);
    }
  },
});

export default upload;
