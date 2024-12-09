import prisma from "../models/index";
import { Prisma } from "@prisma/client";

export class ArticleRepository {
  includeRelations(userId: number) {
    return {
      writer: true,
      favorites: {
        where: { userId },
        select: { id: true, userId: true, articleId: true },
      },
    };
  }

  async findMany(
    whereCondition: Prisma.ArticleWhereInput,
    orderCondition: Prisma.Enumerable<Prisma.ArticleOrderByWithRelationInput>,
    offset: number,
    pageSize: number
  ) {
    return prisma.article.findMany({
      where: whereCondition,
      skip: offset,
      take: pageSize,
      orderBy: orderCondition,
      include: {
        writer: true,
        favorites: true,
      },
    });
  }

  async count(whereCondition: Prisma.ArticleWhereInput) {
    return prisma.article.count({ where: whereCondition });
  }

  async create(
    data: {
      images: string[];
      content: string;
      title: string;
      userId: number;
    },
    userId: number
  ) {
    return prisma.article.create({
      data,
      include: this.includeRelations(userId),
    });
  }

  async findUnique(articleId: number, userId: number) {
    return prisma.article.findUnique({
      where: { id: articleId },
      include: this.includeRelations(userId),
    });
  }

  async update(
    articleId: number,
    data: { images: string[]; title: string; content: string },
    userId: number
  ) {
    return prisma.article.update({
      where: { id: articleId },
      data,
      include: this.includeRelations(userId),
    });
  }

  async delete(articleId: number) {
    await prisma.article.delete({
      where: { id: articleId },
    });
  }

  async createFavorite(articleId: number, userId: number) {
    const [_, article] = await prisma.$transaction([
      prisma.favorite.create({
        data: {
          articleId,
          userId,
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: { increment: 1 },
        },
        include: this.includeRelations(userId),
      }),
    ]);
    return article;
  }

  async deleteFavorite(articleId: number, userId: number) {
    const [_, article] = await prisma.$transaction([
      prisma.favorite.deleteMany({
        where: {
          articleId,
          userId,
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: { decrement: 1 },
        },
        include: this.includeRelations(userId),
      }),
    ]);
    return article;
  }
}
