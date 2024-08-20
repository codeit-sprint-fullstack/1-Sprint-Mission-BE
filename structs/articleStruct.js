import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

export const createArticle = s.object({
  title: s.size(s.string(), 1, 15),
  content: s.size(s.string(), 1, 100),
  userId: Uuid,
});

export const updateArticle = s.partial(createArticle);
