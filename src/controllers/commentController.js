import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 댓글 목록 가져오기
export async function getComments(req, res, next) {
  try {
    const { productId, articleId } = req.params; // productId와 articleId를 모두 추출
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const skip = (page - 1) * pageSize;
    // console.log(req.params.articleId);
    // console.log(req.params.productId);

    // 동적으로 where 조건 설정
    const whereCondition = {};
    if (productId) {
      whereCondition.productId = parseInt(productId, 10);
    } else if (articleId) {
      whereCondition.articleId = parseInt(articleId, 10);
    } else {
      return res
        .status(400)
        .json({ message: "productId 또는 articleId가 필요합니다." });
    }

    // 댓글 목록 가져올 때 유저 정보도 함께 포함
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

    return res.status(200).json({ message: "댓글 목록 추출", comments });
  } catch (error) {
    console.error("댓글 정보 추출 중 오류 발생:", error);
    return res.status(500).json({ message: "댓글 정보를 추출할 수 없습니다." });
  }
}

// 댓글 작성
export async function postComment(req, res, next) {
  try {
    const { productId, articleId } = req.params; // productId와 articleId를 모두 확인
    const { content } = req.body;
    const { userId } = req.user;

    // productId 또는 articleId 중 하나는 필수
    if (!productId && !articleId) {
      return res
        .status(400)
        .json({ message: "productId 또는 articleId가 필요합니다." });
    }

    // 어떤 게시물에 대한 댓글인지 결정 (productId 또는 articleId)
    const commentData = {
      content,
      userId,
      productId: productId ? parseInt(productId, 10) : null,
      articleId: articleId ? parseInt(articleId, 10) : null,
    };

    const comment = await prisma.comment.create({
      data: commentData,
    });

    return res.status(201).json({ message: "댓글 추가 성공", comment });
  } catch (error) {
    console.error("댓글 추가 중 오류 발생:", error);
    return res.status(500).json({ message: "댓글을 추가할 수 없습니다." });
  }
}

// 댓글 삭제
export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    // console.log(commentId);

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
        .json({ message: "해당 댓글이 존재하지 않습니다." });
    }

    // 사용자가 댓글을 삭제할 권한이 있는지 확인
    if (comment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 댓글을 삭제할 권한이 없습니다." });
    }

    // 댓글 삭제
    const deletedComment = await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) },
    });

    return res.status(200).json({ message: "댓글 삭제 성공", deletedComment });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    return res.status(500).json({ message: "댓글을 삭제할 수 없습니다." });
  }
}

// 댓글 수정
export async function patchComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    console.log(commentId);

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
        .json({ message: "해당 댓글이 존재하지 않습니다." });
    }

    // 사용자가 댓글을 수정할 권한이 있는지 확인
    if (comment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 댓글을 수정할 권한이 없습니다." });
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: { content },
    });

    return res.status(200).json({ message: "댓글 변경 성공", updatedComment });
  } catch (error) {
    console.error("댓글 변경 중 오류 발생:", error);
    return res.status(500).json({ message: "댓글을 변경할 수 없습니다." });
  }
}

export default {
  getComments,
  postComment,
  deleteComment,
  patchComment,
};
