import { PrismaClient } from "@prisma/client"; // PrismaClient import

const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성

// 중고마켓 댓글 목록 조회 API 및 등록 API
export const getComments = async (req, res, next) => {
  const { cursor = "", limit = 15, marketPostId } = req.query; // postId를 marketPostId로 변경

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옵니다.
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    // 데이터의 개수 확인을 위한 추가 쿼리
    const totalCount = await prisma.comment.count({
      where: {
        boardType: "market",
        marketPostId: marketPostId ? parseInt(marketPostId) : undefined, // marketPostId 필터링 추가
      },
    });

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
        boardType: "market",
        marketPostId: marketPostId ? parseInt(marketPostId) : undefined,
      },
      orderBy: { id: "asc" }, // id를 기준으로 오름차순 정렬
      take: Number(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
        marketPostId: true, // postId를 marketPostId로 변경
        userId: true,
        user: {
          select: {
            nickname: true, // 닉네임을 선택
          },
        },
      }, // 작성자 ID 포함
    });

    // 닉네임을 댓글 데이터에 포함
    const commentsWithNicknames = comments.map((comment) => ({
      ...comment,
      nickname: comment.user.nickname, // 닉네임 추가
    }));

    res.status(200).json({ totalCount, comments: commentsWithNicknames }); // 응답 형식 변경
  } catch (error) {
    console.error("댓글 목록 조회 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
};

export const createComment = async (req, res, next) => {
  const { content, marketPostId } = req.body;

  if (!content || !marketPostId) {
    return res.status(400).json({ error: "댓글 내용을 입력해주세요." });
  }

  const parsedMarketPostId = parseInt(marketPostId);

  try {
    const postExists = await prisma.marketPost.findUnique({
      where: { id: parsedMarketPostId },
    });

    if (!postExists) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        marketPostId: parsedMarketPostId,
        boardType: "market",
        userId: req.user.id,
      },
    });

    // 사용자 닉네임을 가져옵니다.
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { nickname: true },
    });

    // 사용자 정보와 함께 응답
    res.status(201).json({ ...newComment, user });
  } catch (error) {
    console.error("댓글 등록 중 오류 발생:", error);
    next(error);
  }
};

// 중고마켓 댓글 수정 API
export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  // content가 정의되어 있는지 확인
  if (!content) {
    return res.status(400).json({ error: "댓글 내용을 입력해주세요." });
  }

  try {
    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    // 댓글이 존재하는지 확인
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "수정 권한이 없습니다." });
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("댓글 수정 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
};

// 중고마켓 댓글 삭제 API
export const deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    // 댓글 조회
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    // 댓글이 존재하는지 확인
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자 확인
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "삭제 권한이 없습니다." });
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    next(error); // 에러를 핸들러로 전달
  }
};
