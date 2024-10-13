import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

const createArticleLike = s.object({ articleId: Uuid });

const createProductLike = s.object({ productId: Uuid });

export {createArticleLike, createProductLike}