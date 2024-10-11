// userController.js

import * as userService from '../services/userService.js';

const userController = {
  getCurrentUser: async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data' });
    }
  },

  updateCurrentUser: async (req, res) => {
    try {
      const updatedUser = await userService.updateUserProfile(
        req.user.id,
        req.body
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user data' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changeUserPassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getMyProducts: async (req, res) => {
    // 내가 등록한 상품 조회 로직
    res.json({ message: '내가 등록한 상품 목록' });
  },

  getMyFavorites: async (req, res) => {
    // 내가 좋아요한 상품 조회 로직
    res.json({ message: '내가 좋아요한 상품 목록' });
  },
};

export default userController;
