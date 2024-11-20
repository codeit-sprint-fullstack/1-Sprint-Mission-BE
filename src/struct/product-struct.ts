import * as s from "superstruct";

const createProduct = s.object({
  name: s.size(s.string(), 1, Infinity),
  description: s.size(s.string(), 1, Infinity),
  price: s.refine(s.number(), "price", (value) => value >= 0),
  tags: s.array(s.size(s.string(), 1, Infinity)),
});

const updateProduct = s.partial(createProduct);

type CreateProduct = s.Infer<typeof createProduct>;
type UpdateProduct = s.Infer<typeof updateProduct>;

export { createProduct, updateProduct, CreateProduct, UpdateProduct };
