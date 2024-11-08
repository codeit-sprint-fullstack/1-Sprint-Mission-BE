import { NextFunction, Request, Response } from "express";
import { CursorQuery, UserId } from "../types/service-type";
import commentService from "../services/comment-service";
import { CreateArticleComment } from "../struct/comment-struct";

// article 댓글 목록 조회
async function getCommentListByArticle(
  req: Request<{ id: string }, {}, {}, CursorQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const list = commentService.getCommentListByArticle(req);
    res.send(list);
  } catch (err) {
    return next(err);
  }
}

// article 댓글 생성
async function createArticleComment(
  req: Request<{ id: string }, {}, UserId & CreateArticleComment>,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = await commentService.createArticleComment(req.body);
    res.status(201).send(comment);
  } catch (err) {
    return next(err);
  }
}

export default {
  getCommentListByArticle,
  createArticleComment,
};
