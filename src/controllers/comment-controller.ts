import { NextFunction, Request, Response } from "express";
import { CursorQuery, UserId } from "../types/service-type";
import commentService from "../services/comment-service";
import {
  CreateArticleComment,
  CreateProductComment,
  UpdateComment,
} from "../struct/comment-struct";

type CreateCommentData =
  | (UserId & CreateArticleComment)
  | (UserId & CreateProductComment);

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

// 댓글 생성
async function createComment(
  req: Request<{ id: string }, {}, CreateCommentData>,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).send(comment);
  } catch (err) {
    return next(err);
  }
}

// product 댓글 목록 조회
async function getCommentListByProduct(
  req: Request<{ id: string }, {}, {}, CursorQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const list = commentService.getCommentListByProduct(req);
    res.send(list);
  } catch (err) {
    return next(err);
  }
}

//댓글 수정
async function updateComment(
  req: Request<{ id: string }, {}, UpdateComment>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: commentId } = req.params;
    const comment = await commentService.updateComment(commentId, req.body);
    res.send(comment);
  } catch (err) {
    return next(err);
  }
}

export default {
  getCommentListByArticle,
  createComment,
  getCommentListByProduct,
  updateComment,
};
