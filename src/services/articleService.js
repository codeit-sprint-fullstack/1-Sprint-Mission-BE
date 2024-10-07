import { CreateArticle, assert } from "../validations/structs.js";
import * as articleRepository from "../repositories/articleRepository.js";

export async function getArticles({ orderBy, page, pageSize, keyword }) {
  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case "like":
      sortOption = { likeCount: "desc" };
      break;
    case "recent":
    default:
      sortOption = { createdAt: "desc" };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== "")
    searchQuery = {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    };

  const [totalCount, list] = await Promise.all([
    articleRepository.getTotalCount(searchQuery),
    articleRepository.getAll({ searchQuery, sortOption, offset, pageSize }),
  ]);

  return { totalCount, list };
}

export async function getArticle(id) {
  return await articleRepository.getArticleById(id);
}

export async function createArticle(userId, data) {
  assert(data, CreateArticle);
  return await articleRepository.create(userId, data);
}

export async function updateArticle(id, data) {
  return await articleRepository.updateById(id, data);
}

export async function deleteArticle(id) {
  await articleRepository.deleteById(id);
  return { message: "게시글이 삭제되었습니다" };
}

export async function createLike(articleId, userId) {
  const { likeCount: currentLikeCount } = await articleRepository.findLikeCount(
    articleId
  );
  const hasLiked = await articleRepository.findLikedUser(articleId, userId);

  if (hasLiked) {
    const error = new Error("이미 좋아요를 눌렀습니다.");
    error.statCode = 409;
    throw error;
  }
  const option = { increment: 1 };

  const updatedArticle = await articleRepository.updateLikedUser(
    articleId,
    currentLikeCount,
    option
  );

  return { ...updatedArticle, isLiked: true };
}

export async function deleteLike(articleId, userId) {
  const { likeCount: currentLikeCount } = await articleRepository.findLikeCount(
    articleId
  );
  const hasLiked = await articleRepository.findLikedUser(articleId, userId);

  if (!hasLiked) {
    const error = new Error("이미 좋아요를 취소했습니다.");
    error.statCode = 409;
    throw error;
  }

  const option = { decrement: 1 };

  const updatedArticle = await articleRepository.deleteLikedUser(
    articleId,
    currentLikeCount,
    option
  );

  return { ...updatedArticle, isLiked: false };
}
