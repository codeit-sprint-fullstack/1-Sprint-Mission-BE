import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import {
  CreateArticle,
  createArticle,
  UpdateArticle,
  updateArticle,
} from "../struct/article-struct";

type Method = "post" | "patch";

function article(method: Method) {
  return (
    req: Request<{}, {}, CreateArticle | UpdateArticle>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (method === "post") {
        assert(req.body, createArticle);
        next();
      } else if (method === "patch") {
        assert(req.body, updateArticle);
        next();
      }
    } catch (err) {
      return next(err);
    }
  };
}

export default {
  article,
};
