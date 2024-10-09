import * as articleRepository from '../repositories/articleRepository.js';
import prisma from '../config/prisma.js';

export async function getArticles({ orderBy, page, pageSize, keyword }) {
  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case 'like':
      sortOption = { likeCount: 'desc' };
      break;
    case 'recent':
    default:
      sortOption = { createdAt: 'desc' };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== '')
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

export async function getArticle(articleId, userId) {
  const article = await articleRepository.getArticleById(articleId);
  if (!article) {
    const error = new Error('없는 상품입니다');
    error.code = 404;
    throw error;
  }
  const hasLiked = await articleRepository.findLikedUser(prisma, {
    articleId,
    userId,
  });
  if (!hasLiked) {
    return { ...article, isLiked: false };
  }
  return { ...article, isLiked: true };
}

export async function createArticle(userId, data) {
  return await articleRepository.create(userId, data);
}

export async function updateArticle(id, data) {
  return await articleRepository.updateById(id, data);
}

export async function deleteArticle(id) {
  await articleRepository.deleteById(id);
  return { message: '게시글이 삭제되었습니다' };
}

export async function createLike(articleId, userId) {
  const action = 'like';
  const updatedArticle = await handleUpdateLike({ articleId, userId, action });

  return { ...updatedArticle, isLiked: true };
}
export async function deleteLike(articleId, userId) {
  const action = 'unlike';
  const updatedArticle = await handleUpdateLike({ articleId, userId, action });

  return { ...updatedArticle, isLiked: false };
}

export async function handleUpdateLike({ articleId, userId, action }) {
  try {
    const articleWithUpdatedLike = await prisma.$transaction(async (tx) => {
      const isActionLike = action === 'like';
      const updateOption = isActionLike ? 'connect' : 'disconnect';

      const hasLike = await articleRepository.findLikedUser(tx, {
        articleId,
        userId,
      });

      if (action === 'like' && hasLike) {
        const error = new Error('이미 좋아요를 한 게시글입니다.');
        error.code = 409;
        throw error;
      }

      if (action === 'unlike' && !hasLike) {
        const error = new Error('이미 좋아요를 취소 한 게시글입니다.');
        error.code = 409;
        throw error;
      }

      const article = await articleRepository.findLikeCount(tx, articleId);

      if (!article) {
        const error = new Error('존재하지 않는 게시물입니다.');
        error.code = 404;
        throw error;
      }

      const currentLikeCount = article.likeCount;

      return await articleRepository.updateLikeStatus(tx, {
        articleId,
        currentLikeCount,
        userId,
        updateOption,
      });
    });
    return articleWithUpdatedLike;
  } catch (error) {
    console.error('transaction failed:', error);
    throw error;
  }
}
