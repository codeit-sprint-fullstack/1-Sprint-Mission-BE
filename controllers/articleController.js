import * as articleService from "../services/articleService.js";
import path from "path";

const formatArticleResponse = (article) => ({
  id: article.id,
  title: article.title,
  content: article.content,
  images: Array.isArray(article.images) ? article.images : [],
  likeCount: article.likeCount,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  writer: {
    nickname: article.writer.nickname,
    id: article.writer.id,
  },
  isLiked: article.isLiked,
});

const sendResponse = (res, data, status = 200) => res.status(status).json(data);

export const createArticle = async (req, res, next) => {
  const images = req.files
    ? req.files.map((file) => file.location)
    : req.body.images || [];
  const { content, title } = req.body;
  try {
    const userId = req.user.id;
    const newArticle = await articleService.createArticle(
      images,
      content,
      title,
      userId
    );
    const response = formatArticleResponse(newArticle);
    sendResponse(res, response, 201);
  } catch (error) {
    next(error);
  }
};

export const getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;
    const { list, totalCount } = await articleService.getArticles(
      parseInt(page),
      parseInt(pageSize),
      keyword,
      orderBy
    );
    const responseList = list.map(formatArticleResponse);
    sendResponse(res, { list: responseList, totalCount });
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    const article = await articleService.getArticleById(articleId, userId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const response = formatArticleResponse(article);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const newImagePaths = req.files
      ? req.files.map((file) => file.location)
      : [];

    let existingImages = [];
    if (req.body["existingImages"]) {
      if (Array.isArray(req.body["existingImages"])) {
        existingImages = req.body["existingImages"];
      } else {
        existingImages = [req.body["existingImages"]];
      }
    }

    const images = [...existingImages, ...newImagePaths];
    const { title, content } = req.body;
    const updatedArticle = await articleService.updateArticle(
      articleId,
      images,
      title,
      content
    );
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    await articleService.deleteArticle(articleId);
    sendResponse(res, { message: "Article deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addLike = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    const updatedArticle = await articleService.addLike(articleId, userId);
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteLike = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    const updatedArticle = await articleService.deleteLike(articleId, userId);
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
