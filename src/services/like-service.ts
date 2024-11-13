import { CustomError } from "../middlewares/error-handler";
import articleRepository from "../repositories/article-repository";
import likeRepository from "../repositories/like-repository";
import productRepository from "../repositories/product-repository";
import userRepository from "../repositories/user-repository";
import { CreateArticleLike, CreateProductLike } from "../struct/like-struct";
import { UserId } from "../types/service-type";
import {
  articleCreateLikeMapper,
  productCreateLikeMapper,
} from "./mappers/like-mapper";

// article 좋아요
async function createArticleLike(data: UserId & CreateArticleLike) {
  const { articleId, userId } = data;
  const isDuplicate = await likeRepository.findFirstData({
    where: { articleId, userId },
  });
  if (!isDuplicate) {
    const like = await likeRepository.createData({
      data: { articleId, userId },
    });
    const likeTotal = await likeRepository.countData({ articleId });
    const user = await userRepository.findUniqueOrThrowtData({
      where: { id: userId },
    });
    const article = await articleRepository.findUniqueOrThrowtData({
      where: { id: articleId },
    });

    return articleCreateLikeMapper({
      like,
      likeTotal,
      user,
      article,
    });
  }
  const error: CustomError = new Error("Duplicate entry: like already exists");
  error.status = 409;
  throw error;
}

// article 좋아요 취소
async function deleteArticleLike(articleId: string, userId: string) {
  const isDuplicate = await likeRepository.findFirstData({
    where: { articleId, userId },
  });

  if (isDuplicate) {
    await likeRepository.deleteData({ id: isDuplicate.id });
    const likeTotal = await likeRepository.countData({ articleId });

    return {
      likeCount: likeTotal,
      isLike: false,
    };
  }

  const error: CustomError = new Error(
    "No like found for the specified userId and articleId."
  );
  error.status = 404;
  throw error;
}

// product 좋아요
async function createProductLike(data: UserId & CreateProductLike) {
  const { productId, userId } = data;
  const isDuplicate = await likeRepository.findFirstData({
    where: { productId, userId },
  });
  if (!isDuplicate) {
    const like = await likeRepository.createData({
      data: { productId, userId },
    });
    const likeTotal = await likeRepository.countData({ productId });
    const user = await userRepository.findUniqueOrThrowtData({
      where: { id: userId },
    });
    const product = await productRepository.findUniqueOrThrowtData({
      where: { id: productId },
    });

    return productCreateLikeMapper({
      like,
      likeTotal,
      user,
      product,
    });
  }
  const error: CustomError = new Error("Duplicate entry: like already exists");
  error.status = 409;
  throw error;
}

export default {
  createArticleLike,
  deleteArticleLike,
  createProductLike,
};
