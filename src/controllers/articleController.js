import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postArticle(req, res, next) {
  try {
    console.log("Request Body:", req.body); // 요청 데이터 확인

    const { name, content, images } = req.body;
    const { userId } = req.user;
    const article = await prisma.article.create({
      data: {
        name,
        content,
        images: images || undefined,
        userId,
      },
    });
    return res.status(200).json({ message: "게시물 추가 성공", article });
  } catch (error) {
    console.error("게시물 추가 중 오류 발생:", error);
    console.error("에러 메시지:", error.message);
    console.error("에러 스택:", error.stack); // 에러 스택 출력
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getArticles(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const skip = (page - 1) * pageSize;
    const orderByField = req.query.orderByField || "createdAt";
    const orderDir = req.query.orderDir || "desc";

    const articles = await prisma.article.findMany({
      skip,
      take: pageSize,
      orderBy: { [orderByField]: orderDir },
    });
    return res.status(200).json({ message: "게시물 정보 추출", articles });
  } catch (error) {
    console.error("게시물 정보 추출 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "게시물 정보를 추출할 수 없습니다." });
  }
}

export async function getArticleId(req, res, next) {
  try {
    const { articleId } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId, 10) },
      include: {
        comment: true,
      },
    });
    return res.status(200).json({ message: "게시물 정보 추출", article });
  } catch (error) {
    console.error("게시물 정보 추출 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "게시물 정보를 추출할 수 없습니다." });
  }
}

export async function patchArticle(req, res, next) {
  try {
    const { articleId } = req.params;
    const { name, content, images } = req.body;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!article) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }
    if (article.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "게시물을 변경할 권한이 없습니다." });
    }

    const imagesUrls = images ? images.map((image) => image.url) : [];

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(articleId, 10) },
      data: {
        name: name || undefined,
        content: content || undefined,
        images: imagesUrls.length ? imagesUrls : undefined,
      },
    });
    return res
      .status(200)
      .json({ message: "게시물 정보 변경 성공", updatedArticle });
  } catch (error) {
    console.error("게시물 정보 변경 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "게시물 정보를 변경할 수 없습니다." });
  }
}

export async function deleteArticle(req, res, next) {
  try {
    const { articleId } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!article) {
      return res.status(404).json({ message: "게시물이 존재하지 않습니다." });
    }
    if (article.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "게시물을 삭제할 권한이 없습니다." });
    }
    await prisma.article.delete({ where: { id: parseInt(articleId, 10) } });
    return res.status(200).json({ message: "게시물 삭제 성공" });
  } catch (error) {
    console.error("게시물 삭제 중 오류 발생:", error);
    return res.status(500).json({ message: "게시물를 삭제할 수 없습니다." });
  }
}
