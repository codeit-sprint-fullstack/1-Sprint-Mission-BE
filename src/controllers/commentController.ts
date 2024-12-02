import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import env from '../env';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.baseUrl,
    },
  },
});
// 사용자 요청 객체에 사용자 정보가 포함될 때 타입 정의
export interface CustomRequest extends Request {
  user?: {
    userId: number;
  };
}

// 댓글 목록 가져오기
export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { productId, articleId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const skip = (page - 1) * pageSize;

    const whereCondition: Record<string, any> = {};
    if (productId) {
      whereCondition.productId = parseInt(productId, 10);
    } else if (articleId) {
      whereCondition.articleId = parseInt(articleId, 10);
    } else {
      return res
        .status(400)
        .json({ message: 'productId 또는 articleId가 필요합니다.' });
    }

    const comments = await prisma.comment.findMany({
      where: whereCondition,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            nickName: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json({ message: '댓글 목록 추출', comments });
  } catch (error) {
    console.error('댓글 정보 추출 중 오류 발생:', error);
    next(error);
  }
}

// 댓글 작성
export async function postComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { productId, articleId } = req.params;
    const { content } = req.body;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    const { userId } = user;

    // productId 또는 articleId 중 하나는 필수
    if (!productId && !articleId) {
      return res
        .status(400)
        .json({ message: 'productId 또는 articleId가 필요합니다.' });
    }

    // 댓글 데이터 생성
    const commentData = {
      content,
      userId,
      productId: productId ? parseInt(productId, 10) : null,
      articleId: articleId ? parseInt(articleId, 10) : null,
    };

    const comment = await prisma.comment.create({
      data: commentData,
    });

    return res.status(201).json({ message: '댓글 추가 성공', comment });
  } catch (error) {
    console.error('댓글 추가 중 오류 발생:', error);
    next(error);
  }
}

// 댓글 삭제
export async function deleteComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { commentId } = req.params;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 댓글 존재 여부 확인
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ message: '해당 댓글이 존재하지 않습니다.' });
    }

    // 사용자가 댓글을 삭제할 권한이 있는지 확인
    if (comment.userId !== user.userId) {
      return res
        .status(403)
        .json({ message: '해당 댓글을 삭제할 권한이 없습니다.' });
    }

    // 댓글 삭제
    const deletedComment = await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) },
    });

    return res.status(200).json({ message: '댓글 삭제 성공', deletedComment });
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    next(error);
  }
}

// 댓글 수정
export async function patchComment(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 댓글 존재 여부 확인
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ message: '해당 댓글이 존재하지 않습니다.' });
    }

    // 사용자가 댓글을 수정할 권한이 있는지 확인
    if (comment.userId !== user.userId) {
      return res
        .status(403)
        .json({ message: '해당 댓글을 수정할 권한이 없습니다.' });
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: { content },
    });

    return res.status(200).json({ message: '댓글 변경 성공', updatedComment });
  } catch (error) {
    console.error('댓글 변경 중 오류 발생:', error);
    next(error);
  }
}

export default {
  getComments,
  postComment,
  deleteComment,
  patchComment,
};
