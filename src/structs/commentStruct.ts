import * as s from "superstruct";
import isUuid from "is-uuid";

const uuid = s.define("Uuid", (value: unknown) => {
  // 타입 단언을 통해 'value'가 반드시 'string'이라고 확신
  return isUuid.v4(value as string) || value === "";
});

export const createComment = s.object({
  content: s.size(s.string(), 1, 50),
  articleId: s.optional(uuid),
  productId: s.optional(uuid),
});

export const updateComment = s.partial(createComment);
