import { PrismaClient, Article, Favorite } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customReq';
const prisma = new PrismaClient();

export async function postArticle(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('Request Body:', req.body); // 요청 데이터 확인

    const { name, content, images } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const article = await prisma.article.create({
      data: {
        name,
        content,
        images: images || undefined,
        userId,
      },
    });

    res.status(200).json({ message: '게시물 추가 성공', article });
  } catch (error) {
    console.error('게시물 추가 중 오류 발생:', error);
    next(error); // next 함수로 에러 전달
  }
}

export async function getArticles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string, 10) || 10;
    const skip: number = (page - 1) * pageSize;
    const orderByField: string =
      (req.query.orderByField as string) || 'createdAt';
    const orderDir: 'asc' | 'desc' =
      (req.query.orderDir as 'asc' | 'desc') || 'desc';

    const articles: Article[] = await prisma.article.findMany({
      skip,
      take: pageSize,
      orderBy: { [orderByField]: orderDir },
    });

    return res.status(200).json({ message: '게시물 정보 추출', articles });
  } catch (error) {
    console.error('게시물 정보 추출 중 오류 발생:', error);
    return res
      .status(500)
      .json({ message: '게시물 정보를 추출할 수 없습니다.' });
  }
}

export async function getArticleId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    const { articleId } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId, 10) },
      include: {
        comment: true,
      },
    });

    if (!article) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    return res.status(200).json({ message: '게시물 정보 추출', article });
  } catch (error) {
    console.error('게시물 정보 추출 중 오류 발생:', error);
    return res
      .status(500)
      .json({ message: '게시물 정보를 추출할 수 없습니다.' });
  }
}

export async function patchArticle(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
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
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    if (article.userId !== req.user?.userId) {
      return res
        .status(403)
        .json({ message: '게시물을 변경할 권한이 없습니다.' });
    }

    const imagesUrls = images
      ? images.map((image: { url: string }) => image.url)
      : [];

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
      .json({ message: '게시물 정보 변경 성공', updatedArticle });
  } catch (error) {
    console.error('게시물 정보 변경 중 오류 발생:', error);
    return res
      .status(500)
      .json({ message: '게시물 정보를 변경할 수 없습니다.' });
  }
}

export async function deleteArticle(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
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
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }

    if (article.userId !== req.user?.userId) {
      return res
        .status(403)
        .json({ message: '게시물을 삭제할 권한이 없습니다.' });
    }

    await prisma.article.delete({ where: { id: parseInt(articleId, 10) } });

    return res.status(200).json({ message: '게시물 삭제 성공' });
  } catch (error) {
    console.error('게시물 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '게시물를 삭제할 수 없습니다.' });
  }
}

export async function postArticleFavorite(
  req: CustomRequest,
  res: Response
): Promise<Response> {
  try {
    const { articleId } = req.params;
    const userId = Number(req.user?.userId);

    if (!articleId) {
      return res.status(400).json({ message: 'Article ID가 필요합니다.' });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId: userId,
          articleId: parseInt(articleId),
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      await prisma.article.update({
        where: { id: parseInt(articleId) },
        data: {
          favoriteCount: { decrement: 1 },
        },
      });

      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } else {
      await prisma.favorite.create({
        data: {
          user: {
            connect: { id: userId },
          },
          article: {
            connect: { id: parseInt(articleId) },
          },
        },
      });

      await prisma.article.update({
        where: { id: parseInt(articleId) },
        data: {
          favoriteCount: { increment: 1 },
        },
      });

      return res.status(200).json({ message: '좋아요가 추가되었습니다.' });
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
