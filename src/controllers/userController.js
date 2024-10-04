import userModel from "../models/userModel.js";

const userController = {
  getCurrentUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
  },
  updateCurrentUser: async (req, res) => {
    try {
      const updatedUser = await userModel.updateUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user data" });
    }
  },
};

export default userController;
