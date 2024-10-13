import likeService from "../../services/likeService.js";

async function checkProductLikeStatus(likefilterData, productId) {
  likefilterData.productId = productId;
  const like = await likeService.getByfilter(likefilterData, "product");

  let isLiked;
  if (like) {
    isLiked = true;
  } else if (!like) {
    isLiked = false;
  }
  return isLiked;
}

export default checkProductLikeStatus;
