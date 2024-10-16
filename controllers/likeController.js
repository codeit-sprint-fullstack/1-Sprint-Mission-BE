const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 좋아요 추가
exports.likeProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const like = await prisma.like.create({
      data: {
        productId: parseInt(productId),
        userId: req.user.id,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 좋아요 취소
exports.unlikeProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        productId: parseInt(productId),
        userId: req.user.id,
      },
    });
    res.status(200).json({ message: "좋아요가 취소되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 좋아요 추가
exports.likeArticle = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const like = await prisma.like.create({
      data: {
        articleId: parseInt(articleId),
        userId: req.user.id,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 좋아요 취소
exports.unlikeArticle = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    await prisma.like.deleteMany({
      where: {
        articleId: parseInt(articleId),
        userId: req.user.id,
      },
    });
    res.status(200).json({ message: "좋아요가 취소되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};

