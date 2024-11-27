import { PostData, PostDetailData } from "../../types/post-types";

export function postMapper(data: PostData | PostDetailData) {
  return {
    id: data.id,
    name: data.name,
    content: data.content,
    favoriteCount: data.favoriteCount,
    images: data.PostImage?.map((imgObj) => imgObj.image),
    ownerId: data.User?.id,
    ownerImage: data.User?.image,
    ownerNickname: data.User?.nickname,
    isFavorite: !!data.FavoritePost?.length,
    createdAt: data.createdAt,
  };
}

export function postDetailMapper(data: PostDetailData) {
  return {
    ...postMapper(data),
    comments:
      data.PostComment?.map((comment) => ({
        id: comment.id,
        content: comment.content,
        ownerId: comment.User.id,
        ownerNickname: comment.User.nickname,
        ownerImage: comment.User.image || null,
        createdAt: comment.createdAt,
      })) || [],
  };
}

type PostMapperReturnType = ReturnType<typeof postMapper>;

export function postListMapper({
  count,
  postList,
}: {
  count: number;
  postList: PostData[];
}) {
  const mappedPostList: PostMapperReturnType[] = postList.map(postMapper);
  return { totalCount: count, posts: mappedPostList };
}
