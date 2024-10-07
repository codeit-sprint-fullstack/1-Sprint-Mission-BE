// 자유게시판 게시글 등록 유효성 검사 미들웨어

export const validateArticle = (req, res, next) => {
  const { title, content } = req.body;
  const errors = {};

  if (!title || title.length < 1 || title.length > 20) {
    errors.title = "제목은 1자 이상 20자 이내로 입력해주세요.";
  }

  if (!content || content.length < 10 || content.length > 100) {
    errors.content = "내용은 10자 이상 100자 이내로 입력해주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next(); // 유효성 검사 통과 시 다음 미들웨어로 이동
};
