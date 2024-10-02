import articleRepository from "../repositories/articleRepository.js";

async function create(createData) {
  return await articleRepository.create(createData);
}

async function getAllByFilter(query) {
  const { page = 1, pageSize = 10, orderBy = "recent", keyWord = "" } = query;

  const pageNum = page || 1;
  const pageSizeNum = pageSize || 10;
  const order = orderBy || "recent";
  const offset = (pageNum - 1) * pageSizeNum;
  const whereOr = {
    OR: [
      {
        title: {
          contains: keyWord,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: keyWord,
          mode: "insensitive",
        },
      },
    ],
  };

  const fillter = {
    orderBy: { createdAt: "desc" },
    skip: parseInt(offset),
    take: parseInt(pageSizeNum),
    where: whereOr,
  };

  return await articleRepository.getAllByFilter(fillter);
}

async function countByFilter(query) {
  const { keyWord = "" } = query;
  const fillter = {
    OR: [
      {
        title: {
          contains: keyWord,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: keyWord,
          mode: "insensitive",
        },
      },
    ],
  };

  return await articleRepository.countByFilter(fillter);
}

async function getById(id) {
  return await articleRepository.getById(id);
}

async function update(id, updataData) {
  return await articleRepository.update(id, updataData)
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  getById,
  update
};
