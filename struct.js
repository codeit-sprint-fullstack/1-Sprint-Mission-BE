import * as s from "superstruct";

export const CreateProduct = s.object({
  name: s.size(s.string(), 0, 10),
  description: s.size(s.string(), 10, 1000),
  price: s.min(s.number(), 0),
  tags: s.optional(s.size(s.string(), 0, 5)),
});

// partial은 기존 object를 기반으로 새로운 구조를 만들지만, 모든 속성은 옵셔널(선택사항)
export const PatchProduct = s.partial(CreateProduct);
