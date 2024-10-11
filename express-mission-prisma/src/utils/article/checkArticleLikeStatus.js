import likeService from "../../services/likeService.js";

async function checkArticleLikeStatus(likefilterData, articleId) {
  likefilterData.articleId = articleId;
  const like = await likeService.getByfilter(likefilterData, "article");

  let isLiked;
  if (like) {
    isLiked = true;
  } else if (!like) {
    isLiked = false;
  }
  return isLiked;
}

export default checkArticleLikeStatus;
