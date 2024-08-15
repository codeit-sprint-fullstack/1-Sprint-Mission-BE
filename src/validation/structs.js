import * as s from 'superstruct';
import isUuid from 'is-uuid';

//validate id format
export const Uuid = s.define('Uuid', (value) => isUuid.v4(value));

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 1, 100),
  price: s.min(s.number(), 0),
  tags: s.optional(s.array(s.string())),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 300),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 200),
});

export const PatchComment = s.partial(CreateComment);
