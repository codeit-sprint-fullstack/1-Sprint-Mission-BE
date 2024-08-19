const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("핸들링 되지 않은 에러입니다 :", err);
    next(err);
  });
};

export default asyncHandler;
