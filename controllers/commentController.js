import * as commentService from "../services/commentService.js";

export const createProductComment = async (req, res) => {
  const { content } = req.body;
  const productId = req.params.productId;
  const userId = req.user.id;
  try {
    const newComment = await commentService.createProductComment(
      content,
      userId,
      parseInt(productId)
    );
    const response = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      productId: newComment.productId,
      writer: {
        nickname: newComment.writer.nickname,
        id: newComment.writer.id,
        createdAt: newComment.writer.createdAt,
        updatedAt: newComment.writer.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment", error });
  }
};

export const getProductComments = async (req, res) => {
  try {
    const { limit = 4, cursor = null } = req.query;
    const productId = req.params.productId;

    const { list, nextCursor } = await commentService.getProductComments(
      parseInt(limit),
      cursor,
      parseInt(productId)
    );
    const responseList = list.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      writer: {
        nickname: comment.writer.nickname,
        id: comment.writer.id,
        image: comment.writer.image,
      },
    }));

    res.status(200).json({
      list: responseList,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

export const createArticleComment = async (req, res) => {
  const { content } = req.body;
  const articleId = req.params.articleId;
  const userId = req.user.id;
  try {
    const newComment = await commentService.createArticleComment(
      content,
      userId,
      parseInt(articleId)
    );
    const response = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      articleId: newComment.articleId,
      writer: {
        nickname: newComment.writer.nickname,
        id: newComment.writer.id,
        createdAt: newComment.writer.createdAt,
        updatedAt: newComment.writer.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment", error });
  }
};

export const getArticleComments = async (req, res) => {
  try {
    const { limit = 4, cursor = null } = req.query;
    const articleId = req.params.articleId;

    const { list, nextCursor } = await commentService.getArticleComments(
      parseInt(limit),
      cursor,
      articleId
    );
    const responseList = list.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      writer: {
        nickname: comment.writer.nickname,
        id: comment.writer.id,
        image: comment.writer.image,
      },
    }));

    res.status(200).json({
      list: responseList,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updateComment = await commentService.updateComment(
      commentId,
      content
    );

    res.status(200).json(updateComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Failed to update comment", error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
