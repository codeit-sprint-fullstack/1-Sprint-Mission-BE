const validateFreeBoardMiddleware = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || title.trim() === '') {
    const error = new Error('제목이 없습니다');
    error.code = 400;
    error.status = 400;
    throw error;
  }

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

export default validateFreeBoardMiddleware;
