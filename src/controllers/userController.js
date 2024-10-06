import * as userService from "../services/userService";

export const getUserMe = async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    nickname: user.nickname,
    image: user.image,
    updatedAt: user.updatedAt,
  });
};
