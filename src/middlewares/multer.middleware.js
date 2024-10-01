import multer from 'multer';
import path from 'path';

// 저장할 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일이 저장될 폴더
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});

// multer 미들웨어 설정
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 파일 크기 제한 (1MB)
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // 허용할 파일 확장자
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extName && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: 파일은 이미지여야 합니다.');
    }
  },
});

export default upload;
