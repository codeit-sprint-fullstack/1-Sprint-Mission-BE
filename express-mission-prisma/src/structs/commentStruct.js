import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

const commendBody = {
  content: s.size(s.string(), 1, Infinity),
};

const createArticleComment = s.object({
  ...commendBody,
  articleId: Uuid,
});

const createProductComment = s.object({
  ...commendBody,
  productId: Uuid,
});

const updateComment = s.object({
  ...commendBody,
});

export { createArticleComment, createProductComment, updateComment };
