import * as commentService from "../services/commentService.js";

const createCommentResponse = (comment, type) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  [`${type}Id`]: comment[`${type}Id`],
  writer: {
    nickname: comment.writer.nickname,
    id: comment.writer.id,
    createdAt: comment.writer.createdAt,
    updatedAt: comment.writer.updatedAt,
  },
});

const createComment = async (req, res, next, type) => {
  const { content } = req.body;
  const id = req.params[`${type}Id`];
  const userId = req.user.id;
  try {
    const newComment = await commentService[`create${type}Comment`](
      content,
      userId,
      parseInt(id)
    );

    const response = createCommentResponse(newComment, type);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const createProductComment = (req, res, next) => {
  createComment(req, res, next, "Product");
};

export const createArticleComment = (req, res, next) => {
  createComment(req, res, next, "Article");
};

const getComments = async (req, res, next, type) => {
  try {
    const { limit = 4, cursor = null } = req.query;
    const id = req.params[`${type}Id`];

    const { list, nextCursor } = await commentService[`get${type}Comments`](
      parseInt(limit),
      cursor,
      parseInt(id)
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

    res.status(200).json({ list: responseList, nextCursor });
  } catch (error) {
    next(error);
  }
};

export const getProductComments = (req, res, next) => {
  getComments(req, res, next, "Product");
};

export const getArticleComments = (req, res, next) => {
  getComments(req, res, next, "Article");
};

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await commentService.updateComment(
      commentId,
      content
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
