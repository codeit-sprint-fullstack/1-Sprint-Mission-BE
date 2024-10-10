import likeService from "../services/likeService.js";

async function checkArticleLikeStatus(likeFilterData, articleId) {
  likeFilterData.articleId = articleId;
  const like = await likeService.getByFillter(likeFilterData, "article");

  let isLiked;
  if (like) {
    isLiked = true;
  } else if (!like) {
    isLiked = false;
  }
  return isLiked;
}

export default checkArticleLikeStatus;
