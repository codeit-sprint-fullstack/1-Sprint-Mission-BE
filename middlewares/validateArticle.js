export const validateArticle = (req, res, next) => {
  const { content, title } = req.body;

  if (!title || title.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "게시판 제목은 필수 입력 항목입니다." });
  }

  if (content.length < 10) {
    return res
      .status(400)
      .json({ message: "상품 설명은 최소 10자 이상이어야 합니다." });
  }

  next();
};
