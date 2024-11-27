import * as s from "superstruct";

export const createProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 1, 100),
  price: s.min(s.number(), 0),
  tag: s.string(),
});

export const updateProduct = s.partial(createProduct);
