import * as commentService from '../services/commentService.js';
import { assert, CreateComment, PatchComment } from '../validations/structs.js';

export const getCommentList = async (req, res) => {
  const idParamName = req.idParamName;
  const whichId = req.params[idParamName] || null;
  const limit = parseInt(req.query.limit) * 1 || 5;
  const { cursor: lastId } = req.query;

  const comments = await commentService.getComments({
    idParamName,
    whichId,
    limit,
    lastId,
  });

  return res.json(comments);
};

export const createComment = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  const idParamName = req.idParamName;
  const whichId = req.params[idParamName] || null;

  assert(data, CreateComment);

  const comment = await commentService.createComment({
    idParamName,
    whichId,
    userId,
    data,
  });

  return res.status(201).json(comment);
};

export const updateCommentById = async (req, res) => {
  const { commentId: id } = req.params;
  const userId = req.user.id;
  const data = req.body;

  assert(data, PatchComment);

  const comment = await commentService.updateComment(id, data);
  return res.status(201).json(comment);
};

export const deleteCommentById = async (req, res) => {
  const { commentId: id } = req.params;
  const result = await commentService.deleteComment(id);
  return res.status(200).json(result);
};
