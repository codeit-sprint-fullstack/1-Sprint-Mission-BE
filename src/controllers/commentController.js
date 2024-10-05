import * as commentService from "../services/commentService.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../middlewares/errorMiddleware.js";

export const createComment = async (req, res) => {
  const comment = await commentService.createComment({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const { comments, totalCount } = await commentService.getComments(
    productId,
    page,
    limit
  );
  res.json({ totalCount, list: comments });
};

export const updateComment = async (req, res) => {
  const comment = await commentService.getCommentById(req.params.id);
  if (comment.userId !== req.user.id) {
    throw new ForbiddenError("댓글을 수정할 권한이 없습니다.");
  }
  const updatedComment = await commentService.updateComment(
    req.params.id,
    req.body.content
  );
  res.json(updatedComment);
};

export const deleteComment = async (req, res) => {
  const comment = await commentService.getCommentById(req.params.id);
  if (comment.userId !== req.user.id) {
    throw new ForbiddenError("댓글을 삭제할 권한이 없습니다.");
  }
  await commentService.deleteComment(req.params.id);
  res.status(204).send();
};
