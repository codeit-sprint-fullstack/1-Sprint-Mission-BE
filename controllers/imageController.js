const imageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "이미지를 업로드해 주세요." });
  }

  // 서버의 도메인 URL을 환경변수로 가져옴
  const serverUrl = process.env.SERVER_URL || "https://baomarket.onrender.com";

  // 절대 경로 생성
  const imageUrl = `${serverUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
};

