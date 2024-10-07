import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
