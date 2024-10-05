import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getComments(req, res, next) {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const skip = (page - 1) * pageSize;

    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId, 10) },
      skip,
      take: pageSize,
    });
    return res.status(200).json({ message: "샘플 정보 추출", comments });
  } catch (error) {
    console.error("샘플 정보 추출 중 오류 발생:", error);
    return res.status(500).json({ message: "샘플 정보를 추출할 수 없습니다." });
  }
}

export async function postComment(req, res, next) {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        productId: parseInt(productId, 10),
      },
    });
    return res.status(201).json({ message: "샘플 추가", comment });
  } catch (error) {
    console.error("샘플 추가 중 오류 발생:", error);
    return res.status(500).json({ message: "샘플를 추가할 수 없습니다." });
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;

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

    if (comment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 댓글을 삭제할 권한이 없습니다." });
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) },
    });

    return res.status(200).json({ message: "댓글 삭제 성공", deletedComment });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    return res.status(500).json({ message: "댓글을 삭제할 수 없습니다." });
  }
}

export async function patchComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

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
    if (comment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 댓글을 수정할 권한이 없습니다." });
    }

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
