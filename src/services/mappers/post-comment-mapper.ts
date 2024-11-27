import { PostCommentData } from "../../types/post-comment-types";

export function postCommentMapper(data: PostCommentData) {
  return {
    id: data.id,
    postId: data.postId,
    content: data.content,
    ownerId: data.User.id,
    ownerImage: data.User.image,
    ownerNickname: data.User.nickname,
    createdAt: data.createdAt,
  };
}

type PostCommentMapperReturnType = ReturnType<typeof postCommentMapper>;

export function postCommentListMapper({
  count,
  postCommentList,
}: {
  count: number;
  postCommentList: PostCommentData[];
}) {
  const mappedPostCommentList: PostCommentMapperReturnType[] =
    postCommentList.map(postCommentMapper);
  return { totalCount: count, comments: mappedPostCommentList };
}
