import likeService from "../../services/likeService.js";

async function checkArticleLikeStatus(likeFillterData, articleId) {
  likeFillterData.articleId = articleId;
  const like = await likeService.getByFillter(likeFillterData, "article");

  let isLiked;
  if (like) {
    isLiked = true;
  } else if (!like) {
    isLiked = false;
  }
  return isLiked;
}

export default checkArticleLikeStatus;
