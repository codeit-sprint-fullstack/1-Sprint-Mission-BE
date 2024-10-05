// 좋아요 API 구현
// src/controllers/likeController.js
import * as likeService from "../services/likeService.js";

export const toggleLike = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const userId = req.user.id;
    const result = await likeService.toggleLike(
      userId,
      parseInt(itemId),
      itemType
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "좋아요 처리 중 오류가 발생했습니다." });
  }
};
