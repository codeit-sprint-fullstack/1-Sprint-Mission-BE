import productCommentRepository from "../../repositories/commentRepository/productCommentRepository.js";

async function create(id, createData) {
  const createDataWithId = { ...createData, productId: id };
  return await productCommentRepository.create(createDataWithId);
}

async function getAllByFilter(id, query) {
  const { cursor = "", pageSize, orderBy } = query;

  let pageSizeNum = parseInt(pageSize) || 2;
  if (pageSizeNum) {
    pageSizeNum++;
  }
  const order = orderBy || "recent";
  const findValueDefault = {
    orderBy: { createdAt: "desc" },
    take: pageSizeNum,
    where: { productId: id },
  };
  const findValue =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return await productCommentRepository.getAllByFilter(findValue);
}

async function countByFilter(id) {
  const fillter = { productId: id };
  return await productCommentRepository.countByFilter(fillter);
}

export default {
  create,
  getAllByFilter,
  countByFilter,
};
