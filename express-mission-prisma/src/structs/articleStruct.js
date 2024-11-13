import * as s from "superstruct";

const createArticle = s.object({
  title: s.size(s.string(), 1, Infinity),
  content: s.size(s.string(), 1, Infinity),
});

const updateArticle = s.partial(createArticle);

export { createArticle, updateArticle };
