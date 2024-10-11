import productRepositpry from "../repositories/productRepositpry.js";

async function create(createData) {
  return await productRepositpry.create(createData);
}

async function getById(id) {
  return await productRepositpry.getById(id);
}

async function getAllByFillter(query) {
  const { page, pageSize, orderBy, keyWord = "" } = query;

  const pageNum = page || 1;
  const pageSizeNum = pageSize || 10;
  const order = orderBy || "recent";
  const offset = (pageNum - 1) * pageSizeNum;
  const whereOrBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const whereOr = {
    OR: [
      {
        name: whereOrBody,
      },
      {
        description: whereOrBody,
      },
    ],
  };

  const fillterOptions = {
    orderBy: { createdAt: "desc" },
    skip: parseInt(offset),
    take: parseInt(pageSizeNum),
    where: whereOr,
  };

  return await productRepositpry.getAllByFillter(fillterOptions);
}

async function countByFillter(query) {
  const { keyWord = "" } = query;
  const whereOrBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const whereOr = {
    OR: [
      {
        name: whereOrBody,
      },
      {
        description: whereOrBody,
      },
    ],
  };

  return await productRepositpry.countByFillter(whereOr);
}

export default {
  create,
  getById,
  getAllByFillter,
  countByFillter,
};
