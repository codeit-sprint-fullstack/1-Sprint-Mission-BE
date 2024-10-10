import { assert } from "superstruct";
import { Product } from "../structs/product.js";

export function validateProductInput(req, res, next) {
  try {
    assert(req.body, Product);
    return next();
  } catch (err) {
    return next(err);
  }
}
