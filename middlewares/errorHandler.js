export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "잘못된 요청입니다" });
};

export default errorHandler;
