import { Request, Response, NextFunction } from "express";
import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

// 상품에 댓글 추가
export const createProductComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { content } = req.body;
  const { productId } = req.params;

  try {
    const comment: Comment = await prisma.comment.create({
      data: {
        content,
        productId: Number(productId),
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// 게시글에 댓글 추가
export const createArticleComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { content } = req.body;
  const { articleId } = req.params;

  try {
    const comment: Comment = await prisma.comment.create({
      data: {
        content,
        articleId: Number(articleId),
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 목록 조회
export const getProductComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;

  try {
    const comments: Comment[] = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      include: { user: true },
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// 게시글 댓글 목록 조회
export const getArticleComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { articleId } = req.params;

  try {
    const comments: Comment[] = await prisma.comment.findMany({
      where: { articleId: Number(articleId) },
      include: { user: true },
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 수정
export const updateProductComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.userId !== req.user?.id) {
      res.status(403).json({ error: "본인이 작성한 댓글만 수정할 수 있습니다." });
      return;
    }

    const updatedComment: Comment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 게시글 댓글 수정
export const updateArticleComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.userId !== req.user?.id) {
      res.status(403).json({ error: "본인이 작성한 댓글만 수정할 수 있습니다." });
      return;
    }

    const updatedComment: Comment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 상품 댓글 삭제
export const deleteProductComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.userId !== req.user?.id) {
      res.status(403).json({ error: "본인이 작성한 댓글만 삭제할 수 있습니다." });
      return;
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};

// 게시글 댓글 삭제
export const deleteArticleComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const comment: Comment | null = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      return;
    }

    if (comment.userId !== req.user?.id) {
      res.status(403).json({ error: "본인이 작성한 댓글만 삭제할 수 있습니다." });
      return;
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};
