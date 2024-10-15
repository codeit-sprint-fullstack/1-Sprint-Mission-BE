import { PrismaClient } from "@prisma/client"; // PrismaClient import

const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성

// 자유게시판 게시글 목록 조회 API
export const getArticles = async (req, res, next) => {
  const { sort = "recent", cursor = null, limit = 27, search = "" } = req.query;

  try {
    // 정렬 옵션 설정
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

    // 커서를 기준으로 데이터 조회
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      take: Number(limit),
      ...(cursor && {
        skip: 1, // 커서를 기준으로 하나의 항목을 건너뛰기
        cursor: {
          id: parseInt(cursor), // 커서가 게시글 ID라고 가정
        },
      }),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        likeCount: true,
        author: true,
        imageUrl: true,
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

// 게시글 등록 API (이미지 업로드 추가)
export const createArticle = async (req, res, next) => {
  const { title, content } = req.body;

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
        likeCount: 0,
        author: req.user.id,
        imageUrl: req.file
          ? `http://localhost:8000/uploads/${req.file.filename}` // 업로드된 이미지 경로
          : null, // 이미지가 없으면 null
      },
    });

    res.status(201).json({
      message: "게시글이 성공적으로 등록되었습니다.",
      article: newArticle,
      imageUrl: req.file
        ? `http://localhost:8000/uploads/${req.file.filename}`
        : null,
    });
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 수정 API (이미지 업로드 추가)
export const updateArticle = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    if (article.author !== req.user.id) {
      return res
        .status(403)
        .send({ message: "작성자만 게시글을 수정할 수 있습니다." });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: title || article.title,
        content: content || article.content,
        imageUrl: req.file
          ? `http://localhost:8000/uploads/${req.file.filename}`
          : article.imageUrl,
      },
    });

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
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    // 작성자가 요청한 사용자와 동일한지 확인
    if (article.author !== req.user.id) {
      return res
        .status(403)
        .send({ message: "작성자만 게시글을 삭제할 수 있습니다." });
    }

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    next(error); // 에러 핸들러로 전달
  }
};
