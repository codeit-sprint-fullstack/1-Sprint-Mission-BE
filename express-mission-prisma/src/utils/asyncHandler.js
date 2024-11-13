function asyncHandler(asyncFunc) {
    return async function (req, res, next) {
      try {
        await asyncFunc(req, res, next);
      } catch (e) {
        next(e)
      }
    };
  }

export default asyncHandler