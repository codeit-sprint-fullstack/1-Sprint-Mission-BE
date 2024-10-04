import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../validations/structs.js";
import commentRepository from "../repositories/commentRepository.js";
import { areBothIds } from "../validations/validateFunction.js";

export async function getComments({ articleId, productId, limit, lastId }) {
  areBothIds(articleId, productId);

  const list = await commentRepository.getAll({
    articleId,
    productId,
    limit,
    lastId,
  });

  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { nextCursor, list };
}

export async function createComment({ productId, articleId, userId, data }) {
  areBothIds(articleId, productId);
  assert(data, CreateComment);
  return await commentRepository.create({ productId, articleId, userId, data });
}

export async function updateComment(id, data) {
  assert(data, PatchComment);
  return await commentRepository.updateById(id, data);
}

export async function deleteComment(id) {
  return await commentRepository.deleteById(id);
}
