// articleService.js

import articleModel from '../models/articleModel.js';

export const createArticle = async (data) => {
  return articleModel.create(data);
};

export const getArticles = async (skip, take, orderBy) => {
  const [articles, totalCount] = await Promise.all([
    articleModel.findMany(skip, take, orderBy),
    articleModel.count(),
  ]);

  return { articles, totalCount };
};
