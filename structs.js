import * as s from 'superstruct';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 300),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateProduct = s.object({
  price: s.number(),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 50),
});

export const PatchComment = s.partial(CreateComment);
