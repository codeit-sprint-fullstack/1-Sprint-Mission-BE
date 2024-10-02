import * as s from "superstruct";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

const commendBody = {
  content: s.size(s.string(), 1, Infinity),
};

const createArticleCommend = s.object({
  ...commendBody,
  articleId: Uuid,
});

const createProductCommend = s.object({
  ...commendBody,
  productId: Uuid,
});

const updateCommend = s.object({
  ...commendBody,
});

export {createArticleCommend, createProductCommend, updateCommend}