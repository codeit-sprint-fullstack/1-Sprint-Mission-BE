import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const createProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 1, 100),
  price: s.min(0),
  tag: s.string(),
  userId: Uuid,
});

export const updateArticle = s.partial(createArticle);
