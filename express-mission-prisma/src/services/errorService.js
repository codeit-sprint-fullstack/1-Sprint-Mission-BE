function asyncHandler(asyncFunc) {
    return async function (req, res, next) {
      try {
        await asyncFunc(req, res, next);
      } catch (e) {
        // return next(e)
        if (
          e.name === "StructError" ||
          e instanceof Prisma.PrismaClientValidationError
        ) {
          res.status(400).send({ message: e.message });
        } else if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2025"
        ) {
          res.sendStatus(404);
        } else {
          res.status(500).send({ message: e.message });
        }
      }
    };
  }

export default asyncHandler