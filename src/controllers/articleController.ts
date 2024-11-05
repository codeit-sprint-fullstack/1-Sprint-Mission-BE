import * as articleService from "../services/articleService.js";
import { Request, Response, NextFunction } from "express";

const formatArticleResponse = (article: any) => ({
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

const sendResponse = (res: Response, data: any, status: number = 200) =>
  res.status(status).json(data);

export const createArticle = async (
  req: Request & { files?: Express.Multer.File[]; user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, user } = req;

    // user와 files가 존재하는지 확인
    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const images = files ? files.map((file) => (file as any).location) : [];
    const { content, title }: { content: string; title: string } = req.body;

    const newArticle = await articleService.createArticle(
      images,
      content,
      title,
      user.id
    );
    return sendResponse(res, newArticle, 201);
  } catch (error) {
    next(error);
  }
};

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      pageSize = "10",
      keyword = "",
      orderBy = "recent",
    } = req.query as {
      page?: string;
      pageSize?: string;
      keyword?: string;
      orderBy?: string;
    };
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

export const getArticleById = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const articleId = req.params.articleId;
    const userId = user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const article = await articleService.getArticleById(
      parseInt(articleId),
      userId
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const response = formatArticleResponse(article);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (
  req: Request & {
    files?: Express.Multer.File[];
    user?: { id: number };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, user } = req;
    const { articleId } = req.params;
    const userId = user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newImagePaths = files
      ? files.map((file) => (file as any).location)
      : [];

    let existingImages: string[] = [];
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
      parseInt(articleId),
      userId,
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

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    await articleService.deleteArticle(parseInt(articleId));
    sendResponse(res, { message: "Article deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const { user } = req as Request & { user?: { id: number } };
    const userId = user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedArticle = await articleService.addLike(
      parseInt(articleId),
      userId
    );
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const deleteLike = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId } = req.params;
    const { user } = req;
    const userId = user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedArticle = await articleService.deleteLike(
      parseInt(articleId),
      userId
    );
    const response = formatArticleResponse(updatedArticle);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
