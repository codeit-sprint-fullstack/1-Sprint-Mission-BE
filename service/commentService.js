import commentModel from "../model/commentModel.js";

const getArticleComments = async (req) => {
  const { limit = 5, cursor = "" } = req.query;
  const { id } = req.params;

  const comments = await commentModel.getArticleComments(cursor, limit, id);

  if (comments) {
    const nextComments = comments.length > limit;
    const nextCursor = nextComments ? comments[limit - 1].id : null;

    const returnData = {
      list: comments.slice(0, limit),
      nextCursor,
    };
    return returnData;
  } else {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "댓글 리스트를 찾지 못했습니다.";
    throw error;
  }
};

const getProductComments = async (req) => {
  const { limit = 5, cursor = "" } = req.query;
  const { id } = req.params;

  const comments = await commentModel.getProductComments(cursor, limit, id);

  if (comments) {
    const nextComments = comments.length > limit;
    const nextCursor = nextComments ? comments[limit - 1].id : null;

    const returnData = {
      list: comments.slice(0, limit),
      nextCursor,
    };
    return returnData;
  } else {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "댓글 리스트를 찾지 못했습니다.";
    throw error;
  }
};

const createComment = async (data) => {
  const comment = await commentModel.createComment(data);
  if (!comment) {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "댓글 작성에 실패했습니다.";
    throw error;
  }
  return comment;
};

const updateComment = async (data) => {
  const comment = await commentModel.updateComment(data);
  if (!comment) {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "댓글 수정에 실패했습니다.";
    throw error;
  }
  return comment;
};

const deleteComment = async (id) => {
  const comment = await commentModel.deleteComment(id);
  if (!comment) {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "댓글 삭제에 실패했습니다.";
    throw error;
  }
  return comment;
};

export default {
  getArticleComments,
  getProductComments,
  createComment,
  updateComment,
  deleteComment,
};
