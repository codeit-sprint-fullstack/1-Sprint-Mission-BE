import { assert } from "superstruct";
import { Product } from "../structs/product.js";
import { Comment } from "../structs/comment.js";

export function validateProductInput(req, res, next) {
  try {
    assert(req.body, Product);
    return next();
  } catch (err) {
    return next(err);
  }
}

export function validateCommentInput(req, res, next) {
  try {
    assert(req.body, Comment);
    return next();
  } catch (err) {
    return next(err);
  }
}
