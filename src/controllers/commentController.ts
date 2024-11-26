import * as commentService from "../services/commentService";
import { Request, Response, NextFunction } from "express";

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  writer: {
    nickname: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

const createCommentResponse = (comment: Comment, type: string) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  [`${type}Id`]: (comment as any)[`${type}Id`],
  writer: {
    nickname: comment.writer.nickname,
    id: comment.writer.id,
    createdAt: comment.writer.createdAt,
    updatedAt: comment.writer.updatedAt,
  },
});

const createComment = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction,
  type: string
) => {
  const serviceType = type.charAt(0).toUpperCase() + type.slice(1);
  const { content } = req.body;
  const id = req.params[`${type}Id`];
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const newComment = await (commentService as any)[
      `create${serviceType}Comment`
    ](content, userId, parseInt(id));

    const response = createCommentResponse(newComment, type);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const createProductComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createComment(req, res, next, "product");
};

export const createArticleComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createComment(req, res, next, "article");
};

const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
  type: string
) => {
  try {
    const serviceType = type.charAt(0).toUpperCase() + type.slice(1);
    const { limit = "4", cursor = null } = req.query as {
      limit?: string;
      cursor?: string | null;
    };
    const id = req.params?.[`${type}Id`];
    const { list, nextCursor } = await (commentService as any)[
      `get${serviceType}Comments`
    ](parseInt(limit), cursor, parseInt(id));

    const responseList = list.map((comment: Comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      writer: {
        nickname: comment.writer.nickname,
        id: comment.writer.id,
        image: (comment.writer as any).image,
      },
    }));

    res.status(200).json({ list: responseList, nextCursor });
  } catch (error) {
    next(error);
  }
};

export const getProductComments = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getComments(req, res, next, "product");
};

export const getArticleComments = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getComments(req, res, next, "article");
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await commentService.updateComment(
      commentId,
      content
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
