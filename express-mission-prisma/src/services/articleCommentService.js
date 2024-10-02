import articleCommentRepository from "../repositories/articleCommentRepository.js";

async function create(id, createData) {
  const createDataWithId = { ...createData, articleId: id };
  return await articleCommentRepository.create(createDataWithId);
}

async function getAllByFilter(id, query) {
  const { cursor = "", pageSize = 5, orderBy = "recent" } = query;

  let pageSizeNum = parseInt(pageSize) || 5;
  if (pageSizeNum) {
    pageSizeNum++;
  }
  const order = orderBy || "recent";
  const findValueDefault = {
    orderBy: { createdAt: "desc" },
    take: pageSizeNum,
    where: { articleId: id },
  };
  const findValue =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return await articleCommentRepository.getAllByFilter(findValue);
}

async function countByFilter(id) {
  const fillter = { articleId: id };
  return await articleCommentRepository.countByFilter(fillter);
}

export default {
  create,
  getAllByFilter,
  countByFilter,
};
