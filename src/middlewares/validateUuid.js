import { assert } from "superstruct";
import { Uuid } from "../validations/structs";

const idParams = ["articleId", "productId", "commentId"];

const validateUuid = (req, res, next) => {
  try {
    const whichIdParam = idParams.find((idParam) => req.params[idParam]);

    if (!whichIdParam) {
      throw new Error("ID param is missing.");
    }

    const id = req.params[whichIdParam];
    assert(id, Uuid);

    next();
  } catch (error) {
    next(error);
  }
};

export default validateUuid;
