import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

// Express의 Request 인터페이스를 확장하여 사용자 정의 속성 추가
interface AuthenticatedRequest extends Request {
  user: { id: number }; // 실제 사용자 모델에 맞게 타입 조정 필요
}

// 상품에 댓글 추가
export const createProductComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body; // 댓글 내용
  const { productId } = req.params; // 상품 ID

  // 댓글 작성자와 상품 ID 확인
  console.log(
    '댓글 작성자 userId:',
    req.user ? req.user.id : 'userId가 없습니다.'
  );
  console.log('등록할 상품 ID:', productId);

  try {
    const comment = await prisma.comment.create({
      data: {
        content, // 댓글 내용
        productId: parseInt(productId, 10), // 문자열을 숫자로 변환 (두 번째 매개변수는 진수를 나타냄)
        userId: req.user.id, // 현재 사용자 ID로 설정
      },
    });

    // 생성된 댓글 확인
    console.log('생성된 댓글:', comment);

    res.status(201).json(comment); // 생성된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글에 댓글 추가
export const createArticleComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body; // 댓글 내용 가져오기
  const { articleId } = req.params; // 게시글 ID 가져오기

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(articleId, 10), // 문자열을 숫자로 변환
        userId: req.user.id, // 현재 사용자 ID로 설정
      },
    });
    res.status(201).json(comment); // 생성된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 목록 조회
export const getProductComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params; // 상품 ID 가져오기

  console.log('불러올 상품 ID:', productId);

  if (!productId) {
    console.error('상품 ID가 제공되지 않았습니다.');
    return res.status(400).json({ error: '상품 ID가 제공되지 않았습니다.' });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId, 10) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });

    console.log('불러온 댓글 목록:', comments);

    if (comments.length === 0) {
      return res.status(404).json({ message: '댓글이 없습니다.' });
    }

    res.status(200).json(comments); // 불러온 댓글 목록 응답으로 반환
  } catch (error) {
    console.error('댓글 목록 불러오기 중 오류:', error);
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 목록 조회
export const getArticleComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { articleId } = req.params; // 게시글 ID 가져오기

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId, 10) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });
    res.status(200).json(comments); // 불러온 댓글 목록 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 수정
export const updateProductComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // 댓글 ID 가져오기
  const { content } = req.body; // 수정할 댓글 내용 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id, 10) },
      data: { content },
    });

    res.status(200).json(updatedComment); // 수정된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 수정
export const updateArticleComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // 댓글 ID 가져오기
  const { content } = req.body; // 수정할 댓글 내용 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id, 10) },
      data: { content },
    });

    res.status(200).json(updatedComment); // 수정된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 삭제
export const deleteProductComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // 댓글 ID 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 삭제
export const deleteArticleComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // 댓글 ID 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
