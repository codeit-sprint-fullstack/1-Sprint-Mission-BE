const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 생성
exports.createArticle = async (req, res, next) => {
  const { title, content, tags, images } = req.body;

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        tags,
        image: images || [], // req.body.images 사용
        userId: req.user.id,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 목록 조회
exports.getArticles = async (req, res, next) => {
  const { page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = req.query;

  let sortBy = {};
  if (orderBy === 'recent') {
    sortBy = { createdAt: 'desc' };
  } else if (orderBy === 'like') {
    sortBy = { likes: { _count: 'desc' } };
  }

  try {
    const articles = await prisma.article.findMany({
      where: keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}, // keyword가 빈 문자열일 경우 조건을 무시
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
      orderBy: sortBy,
      include: {
        likes: true,
        comments: true,
        user: true,
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    next(error); // 에러 전달
  }
};


// 특정 게시글 조회
exports.getArticleById = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      include: {
        likes: true,
        comments: true,
        user: true,
      },
    });
    if (!article) {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }

    const isLiked = article.likes.some(like => like.userId === req.user.id);
    res.status(200).json({ ...article, isLiked });
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 수정
exports.updateArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const { title, content, tags, images } = req.body;

  try {
    const article = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: { title, content, tags, image: images || [] },
    });
    res.status(200).json(article);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 게시글 삭제
exports.deleteArticle = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    await prisma.article.delete({
      where: { id: parseInt(articleId) },
    });
    res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};
