import { NextFunction, Request, Response } from "express";
import { CursorQuery } from "../types/service-type";
import commentService from "../services/comment-service";

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

export default {
  getCommentListByArticle,
};
