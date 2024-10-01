import * as s from "superstruct";
import isUuid from "is-uuid";

const uuid = s.define("Uuid", (value) => isUuid.v4(value) || value === "");

export const createComment = s.object({
  content: s.size(s.string(), 1, 50),
  //userId: Uuid,
  articleId: s.optional(uuid),
  productId: s.optional(uuid),
});

export const updateComment = s.partial(createComment);
