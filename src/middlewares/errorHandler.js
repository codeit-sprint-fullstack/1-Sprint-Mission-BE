const errorHandler = (err, req, res, next) => {
  // console.error(err);

  const statusCode = err.status || 500; 
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.message || '서버 내부 오류가 발생했습니다.';

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: errorMessage,
    },
  });
};
export default errorHandler;
