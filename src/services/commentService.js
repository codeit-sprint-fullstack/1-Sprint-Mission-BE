// commentService.js

import commentModel from '../models/commentModel.js';

export const createComment = async (data) => {
  return commentModel.create(data);
};

export const getComments = async (productId, page, limit) => {
  const skip = (page - 1) * limit;
  const [comments, totalCount] = await Promise.all([
    commentModel.findMany(
      { productId: Number(productId) },
      skip,
      Number(limit),
      { createdAt: 'desc' },
      { user: { select: { id: true, nickname: true } } }
    ),
    commentModel.count({ productId: Number(productId) }),
  ]);

  return { comments, totalCount };
};

export const updateComment = async (id, content) => {
  return commentModel.update(id, { content });
};

export const deleteComment = async (id) => {
  return commentModel.delete(id);
};
