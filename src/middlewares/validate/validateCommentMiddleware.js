const validateCommentMiddleware = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    {
      const error = new Error('내용이 없습니다');
      error.code = 400;
      error.status = 400;
      throw error;
    }
  }

  next();
};

export default validateCommentMiddleware;
