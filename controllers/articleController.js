import { PrismaClient } from "@prisma/client"; // PrismaClient import

const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성

// 게시글 목록 조회 API
export const getArticles = async (req, res, next) => {
  const { sort = "recent", offset = 0, limit = 27, search = "" } = req.query;

  try {
    // 정렬 옵션 설정(최신순)
    const orderBy = sort === "recent" ? { createdAt: "desc" } : {};

    // 검색 조건 설정
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // 페이지네이션 및 검색 적용
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likeCount: true, // 추가된 속성
        author: true, // 추가된 속성
        imageUrl: true, // 추가된 속성
      },
    });

    res.status(200).send(articles);
  } catch (error) {
    console.error("게시글 목록 조회 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 상세 조회 API
export const getArticleById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likeCount: true, // 추가된 필드
        author: true, // 추가된 필드
        imageUrl: true, // 추가된 필드
      },
    });

    if (!article) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).send(article);
  } catch (error) {
    console.error("게시글 상세 조회 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 등록 API
export const createArticle = async (req, res, next) => {
  const {
    title,
    content,
    likeCount = 0,
    author = "",
    imageUrl = "",
  } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "게시글 제목과 내용은 필수로 입력해주세요." });
  }

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        likeCount,
        author,
        imageUrl,
      },
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 수정 API
export const updateArticle = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, likeCount, author, imageUrl } = req.body;

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        likeCount, // 추가된 필드
        author, // 추가된 필드
        imageUrl, // 추가된 필드
      },
    });

    if (!updatedArticle) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).send(updatedArticle);
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 삭제 API
export const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedArticle = await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};
