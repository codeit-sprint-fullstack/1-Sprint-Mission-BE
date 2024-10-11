import { assert } from "superstruct";

import { User, EmailPassword } from "../structs/user.js";
import { Product } from "../structs/product.js";
import { Comment } from "../structs/comment.js";

export function validateUserInput(req, res, next) {
  try {
    assert(req.body, User);
    return next();
  } catch (err) {
    return next(err);
  }
}

export function validatteEmailPasswordInput(req, res, next) {
  try {
    assert(req.body, EmailPassword);
    return next();
  } catch (err) {
    return next(err);
  }
}

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
