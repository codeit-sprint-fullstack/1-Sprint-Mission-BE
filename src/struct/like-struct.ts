import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value: unknown): boolean => {
  if (typeof value === "string") {
    return isUuid.v4(value);
  }
  return false;
});

const createArticleLike = s.object({ articleId: Uuid });

const createProductLike = s.object({ productId: Uuid });

type CreateArticleLike = s.Infer<typeof createArticleLike>;
type CreateProductLike = s.Infer<typeof createProductLike>;

export {
  createArticleLike,
  createProductLike,
  CreateArticleLike,
  CreateProductLike,
};
