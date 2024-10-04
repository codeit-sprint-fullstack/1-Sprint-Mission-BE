import * as articleService from "../services/articleService.js";

const formatArticleResponse = (article) => ({
  id: article.id,
  title: article.title,
  content: article.content,
  image: article.image,
  likeCount: article.likeCount,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  writer: {
    nickname: article.writer.nickname,
    id: article.writer.id,
  },
});

const sendResponse = (res, data, status = 200) => res.status(status).json(data);

export const createArticle = async (req, res, next) => {
  const { image, content, title } = req.body;
  try {
    const userId = req.user.id;
    const newArticle = await articleService.createArticle(
      image,
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
    const article = await articleService.getArticleById(articleId);

    if (!article) {
      const error = new Error("Article not found");
      error.name = "NotFoundError";
      throw error;
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
    const { image, title, content } = req.body;
    const updatedArticle = await articleService.updateArticle(
      articleId,
      image,
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
    const updatedArticle = await articleService.addLike(articleId);
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteLike = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const updatedArticle = await articleService.deleteLike(articleId);
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
