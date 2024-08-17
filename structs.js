import * as s from 'superstruct';

export const CreateArticle = s.object({
  title: s.size(s.string(), 2, 50),
  content: s.size(s.string(), 1, 100),
});

export const PatchArticle = s.partial(CreateArticle);
