// 이미지 업로드 처리
const imageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지를 업로드해 주세요.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
};

module.exports = {
  imageUpload,
};

