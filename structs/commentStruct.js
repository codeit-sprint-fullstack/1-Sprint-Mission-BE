import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const createComment = s.object({
  content: s.size(s.string(), 1, 50),
  userId: Uuid,
  articleId: Uuid,
});

export const updateComment = s.partial(createComment);
