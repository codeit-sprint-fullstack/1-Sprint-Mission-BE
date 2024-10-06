import * as s from "superstruct";
import isUuid from "is-uuid";
import { assert } from "superstruct";
import isEmail from "is-email";

export { assert };

export const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

const email = () => s.define("email", (value) => isEmail(value));

export const CreateProduct = s.object({
  name: s.size(s.string(), 3, 30),
  description: s.size(s.string(), 10, 200),
  price: s.min(s.number(), 0),
  tags: s.optional(s.array(s.string())),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 50),
  content: s.size(s.string(), 1, 500),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 200),
});

export const PatchComment = s.partial(CreateComment);

export const CreateUser = s.object({
  email: email(),
  nickname: s.size(s.string(), 1, 20),
});

export const PatchUser = s.partial(CreateUser);
