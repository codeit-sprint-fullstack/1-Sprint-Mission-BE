import { Request, Response, NextFunction } from "express";
import { PrismaClient, Article } from "@prisma/client";

const prisma = new PrismaClient();

// 게시글 생성
export const createArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, content, tags, images } = req.body;

  try {
    const article: Article = await prisma.article.create({
      data: {
        title,
        content,
        tags,
        image: images || [],
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 목록 조회
export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { page = 1, pageSize = 10, orderBy = "recent", keyword = "" } = req.query;

  let sortBy: any = {};
  if (orderBy === "recent") {
    sortBy = { createdAt: "desc" };
  } else if (orderBy === "like") {
    sortBy = { likes: { _count: "desc" } };
  }

  try {
    const articles: Article[] = await prisma.article.findMany({
      where: keyword
        ? {
            OR: [
              { title: { contains: keyword as string, mode: "insensitive" } },
              { content: { contains: keyword as string, mode: "insensitive" } },
            ],
          }
        : {},
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: sortBy,
      include: {
        likes: true,
        comments: true,
        user: true,
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

// 특정 게시글 조회
export const getArticleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { articleId } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(articleId) },
      include: {
        likes: true,
        comments: true,
        user: true,
      },
    });
    if (!article) {
      res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
      return;
    }

    const isLiked = article.likes.some((like: { userId: number }) => like.userId === req.user?.id);
    res.status(200).json({ ...article, isLiked });
  } catch (error) {
    next(error);
  }
};


// 게시글 수정
export const updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { articleId } = req.params;
  const { title, content, tags, images } = req.body;

  try {
    const article: Article = await prisma.article.update({
      where: { id: Number(articleId) },
      data: { title, content, tags, image: images || [] },
    });
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
export const deleteArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { articleId } = req.params;

  try {
    await prisma.article.delete({
      where: { id: Number(articleId) },
    });
    res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};
