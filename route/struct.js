import * as s from 'superstruct';
import isEmail from 'is-email';

export const CreateUser = s.object({
  email: s.define('Email', isEmail),
  name: s.size(s.string(), 1, 30),
});

export const PatchUser = s.partial(CreateUser);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 100),
  category: s.string(),
  userId: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 100),
  userId: s.string(),
  articleId: s.string(),
});

export const PatchComment = s.partial(CreateComment);
