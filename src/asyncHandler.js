function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  };
}

export default asyncHandler;
