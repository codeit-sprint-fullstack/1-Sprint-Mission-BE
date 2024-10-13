import postRepository from "../repositories/postRepository";

export async function createPost({ userId, data }) {
  const newPostData = { userId, ...data };

  return await postRepository.createPost(newPostData);
}

export async function getPosts(query) {
  const { keyword } = query;
  const postsPromise = postRepository.getPostsInfoByQuery(query);
  const totalCountPromise =
    postRepository.getPostsInfoByKeywordTotalCount(keyword);
  const [posts, totalCount] = Promise.all([postsPromise, totalCountPromise]);

  return { totalCount, posts };
}

export async function getPostDetail(postId) {
  return await postRepository.getPostDetailByPostId(postId);
}

export async function updatePost({ postId, data }) {
  return await postRepository.updatePost({ postId, data });
}

export async function deletePost(postId) {
  return await postRepository.deletePost(postId);
}

export async function increaseFavoritePost({ userId, postId }) {
  return await postRepository.increasePostFavoriteCount({
    userId,
    postId,
  });
}

export async function decreaseFavoritePost({ userId, postId }) {
  return postRepository.decreasePostFavoriteCount({
    userId,
    postId,
  });
}
