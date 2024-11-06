import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value: unknown): boolean => {
  if (typeof value === "string") {
    return isUuid.v4(value);
  }
  return false;
});

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

type CreateArticleComment = s.Infer<typeof createArticleComment>;
type CreateProductComment = s.Infer<typeof createProductComment>;
type UpdateComment = s.Infer<typeof updateComment>;

export {
  createArticleComment,
  createProductComment,
  updateComment,
  CreateArticleComment,
  CreateProductComment,
  UpdateComment,
};
