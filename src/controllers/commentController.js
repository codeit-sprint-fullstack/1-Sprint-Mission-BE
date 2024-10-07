const { Comment, User } = require("../models");

// 특정 게시물(제품 또는 기사)의 모든 댓글 조회
exports.getCommentsByItem = async (req, res) => {
  const { itemId, itemType } = req.params; // itemType은 'product' 또는 'article'일 수 있음
  try {
    const whereClause =
      itemType === "product" ? { ProductId: itemId } : { ArticleId: itemId };

    const comments = await Comment.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ["nickname", "image"] }],
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

// 특정 제품에 대한 모든 댓글 조회
exports.getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { ProductId: productId },
      include: [{ model: User, attributes: ["nickname", "image"] }],
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

// 특정 기사에 대한 모든 댓글 조회
exports.getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { ArticleId: articleId },
      include: [{ model: User, attributes: ["nickname", "image"] }],
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

// 댓글 생성
exports.createComment = async (req, res) => {
  const { content, itemId, itemType } = req.body;
  const userId = req.user.id; // 인증된 사용자 ID
  try {
    const newComment = await Comment.create({
      content,
      UserId: userId,
      ProductId: itemType === "product" ? itemId : null,
      ArticleId: itemType === "article" ? itemId : null,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "댓글 생성 실패", error });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "본인 댓글만 수정할 수 있습니다." });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "댓글 수정 실패", error });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "본인 댓글만 삭제할 수 있습니다." });
    }

    await comment.destroy();
    res.status(200).json({ message: "댓글 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "댓글 삭제 실패", error });
  }
};
