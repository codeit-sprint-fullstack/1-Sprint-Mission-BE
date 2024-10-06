import * as commentService from "../services/commentService.js";
import { areBothIdsNull } from "../validations/validateFunction.js";

export const getCommentList = async (req, res) => {
  const { articleId, productId } = req.params || null;
  const limit = parseInt(req.query.limit) * 1 || 5;
  const { cursor: lastId } = req.query;

  areBothIdsNull(articleId, productId);

  const comments = await commentService.getComments({
    articleId,
    limit,
    lastId,
    productId,
  });

  return res.json(comments);
};

export const createComment = async (req, res) => {
  const { articleId, productId } = req.params || null;
  const data = req.body;

  areBothIdsNull(articleId, productId);

  const comment = await commentService.createComment({
    productId,
    articleId,
    userId,
    data,
  });

  return res.status(201).json(comment);
};

export const updateCommentById = async (req, res) => {
  const { commentId: id } = req.params;
  const data = req.body;
  const comment = await commentService.updateComment(id, data);
  return res.status(201).json(comment);
};

export const deleteCommentById = async (req, res) => {
  const { commentId: id } = req.params;
  const result = await commentService.deleteComment(id);
  return res.status(200).json(result);
};
