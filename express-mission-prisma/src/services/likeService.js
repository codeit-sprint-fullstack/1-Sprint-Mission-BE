import likeRepository from "../repositories/likeRepository.js";

async function create(createData) {
  return await likeRepository.create(createData);
}

async function getByFillter(findData, type) {
  let fillterOptions;
  if (type === "article") {
    fillterOptions = {
      userId: findData.userId,
      articleId: findData.articleId,
    };
  } else if (type === "product") {
    fillterOptions = {
      userId: findData.userId,
      productId: findData.productId,
    };
  }
  return await likeRepository.getByFillter(fillterOptions);
}

async function countByFilter(findData, type) {
  let fillterOptions;
  if (type === "article") {
    fillterOptions = {
      articleId: findData.articleId,
    };
  } else if (type === "product") {
    fillterOptions = {
      productId: findData.productId,
    };
  }
  return await likeRepository.countByFilter(fillterOptions);
}

export default {
  create,
  getByFillter,
  countByFilter,
};
