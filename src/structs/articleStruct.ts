import * as s from "superstruct";

export const createArticle = s.object({
  title: s.size(s.string(), 1, 15),
  content: s.size(s.string(), 1, 100),
});

export const updateArticle = s.partial(createArticle);
