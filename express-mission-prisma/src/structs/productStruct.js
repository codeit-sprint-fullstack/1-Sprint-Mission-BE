import * as s from "superstruct";

const createProduct = s.object({
  name: s.size(s.string(), 1, Infinity),
  description: s.size(s.string(), 1, Infinity),
  price: s.refine(s.number(), "price", (value) => value >= 0),
  tag: s.array(s.size(s.string(), 1, Infinity)),
});

export { createProduct };
