import multer from 'multer';
import path from 'path';

// 저장할 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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
