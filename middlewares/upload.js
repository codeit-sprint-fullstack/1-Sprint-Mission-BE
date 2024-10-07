// 이미지 파일을 업로드하는 데 사용되는 미들웨어

import multer from "multer"; // multer import

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일을 저장할 경로
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // 안전한 파일 이름으로 변경
    cb(null, Date.now() + "-" + sanitizedFileName); // 수정된 파일 이름 사용
  },
});

const upload = multer({ storage });

// 이미지 업로드 미들웨어
export const uploadImageMiddleware = upload.array("images", 3); // "image"는 클라이언트에서 보내는 파일 필드 이름
