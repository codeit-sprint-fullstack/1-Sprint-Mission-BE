import * as commentRepository from '../repositories/commentRepository.js';
import { checkEntityName } from '../utils/utilFunctions.js';

export async function getComments({ idParamName, whichId, limit, lastId }) {
  const whichEntity = checkEntityName(idParamName);
  console.log('whichEntity', whichEntity);
  const list = await commentRepository.getAll({
    whichEntity,
    whichId,
    limit,
    lastId,
  });

  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { nextCursor, list };
}

export async function createComment({ whichId, idParamName, userId, data }) {
  let whichEntity;
  switch (idParamName) {
    case 'articleId':
      whichEntity = 'article';
      break;
    case 'productId':
      whichEntity = 'product';
      break;
    default:
      const error = new Error('유효한 id param이 아님.');
      error.code = 400;
      throw error;
  }

  return await commentRepository.create({ whichId, whichEntity, userId, data });
}

export async function updateComment(id, data) {
  return await commentRepository.updateById(id, data);
}

export async function deleteComment(id) {
  await commentRepository.deleteById(id);
  return { message: '댓글이 삭제되었습니다' };
}
