import * as userService from "../services/userService.js";

export const getUserById = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, email, nickname, image, createdAt, updatedAt } = req.user;

    const userData = { id, email, nickname, image, createdAt, updatedAt };

    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
