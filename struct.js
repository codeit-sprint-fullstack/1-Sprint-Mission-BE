import * as s from "superstruct";

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 10, 1000),
  price: s.min(s.number(), 1),
  tags: s.optional(s.size(s.string(), 1, 5)),
});

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 1000),
});

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 1000),
});

// partial은 기존 object를 기반으로 새로운 구조를 만들지만, 모든 속성은 옵셔널(선택사항)
export const PatchProduct = s.partial(CreateProduct);

export const PatchArticle = s.partial(CreateArticle);

export const PatchComment = s.partial(CreateComment);
