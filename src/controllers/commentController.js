import * as commentService from "../services/commentService.js";
import {
  ValidationError,
  NotFoundError,
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
  const updatedComment = await commentService.updateComment(
    req.params.id,
    req.body.content
  );
  if (!updatedComment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }
  res.json(updatedComment);
};

export const deleteComment = async (req, res) => {
  await commentService.deleteComment(req.params.id);
  res.status(204).send();
};
