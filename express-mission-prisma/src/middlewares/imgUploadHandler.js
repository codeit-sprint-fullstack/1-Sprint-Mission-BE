import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
};

const imgUploadHandler = multer({
  dest: "uploads/",
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).array("images", 3);

export default imgUploadHandler;
