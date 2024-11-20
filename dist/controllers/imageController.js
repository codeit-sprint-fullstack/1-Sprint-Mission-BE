"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUpload = (req, res) => {
    // 업로드된 파일이 없는 경우 에러 반환
    if (!req.file) {
        res.status(400).json({ error: "이미지를 업로드해 주세요." });
        return;
    }
    // 서버의 도메인 URL을 환경변수에서 가져옴
    const serverUrl = process.env.SERVER_URL || "https://baomarket.onrender.com";
    // 이미지 URL 생성
    const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
};
exports.default = imageUpload;
