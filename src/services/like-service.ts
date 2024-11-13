import { CustomError } from "../middlewares/error-handler";
import articleRepository from "../repositories/article-repository";
import likeRepository from "../repositories/like-repository";
import userRepository from "../repositories/user-repository";
import { CreateArticleLike } from "../struct/like-struct";
import { UserId } from "../types/service-type";
import { articleLikeMapper } from "./mappers/like-mapper";

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

    return articleLikeMapper({
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

export default {
  createArticleLike,
  deleteArticleLike,
};
