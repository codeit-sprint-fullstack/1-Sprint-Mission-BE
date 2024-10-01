const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 상품에 댓글 추가
exports.createProductComment = async (req, res, next) => {
  const { content } = req.body;
  const { productId } = req.params;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        productId: parseInt(productId),
        userId: req.user.id,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글에 댓글 추가
exports.createArticleComment = async (req, res, next) => {
  const { content } = req.body;
  const { articleId } = req.params;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(articleId),
        userId: req.user.id,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 댓글 목록 조회
exports.getProductComments = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 댓글 목록 조회
exports.getArticleComments = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 댓글 수정
exports.updateProductComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.status(200).json(comment);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 댓글 수정
exports.updateArticleComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.status(200).json(comment);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 댓글 삭제
exports.deleteProductComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 댓글 삭제
exports.deleteArticleComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};

