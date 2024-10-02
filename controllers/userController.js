import * as userService from "../services/userService.js";

export const getUserById = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = await userService.getUserById(user.id);

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      return res.status(500).json({ message: "Failed to get user", error });
    }
  }
};
