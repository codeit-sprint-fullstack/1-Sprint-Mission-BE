import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";

function article(method) {
  return (req, res, next) => {
    if (method === "post") {
      assert(req.body, createArticle);
      next();
    } else if (method === "patch") {
      assert(req.body, updateArticle);
      next();
    }
  };
}

export default {
  article,
};
