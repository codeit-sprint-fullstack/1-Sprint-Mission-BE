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
    const fileTypes = /jpeg|jpg|png|gif/;  ㅇ
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
