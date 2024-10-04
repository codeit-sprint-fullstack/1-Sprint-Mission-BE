import userService from '../services/userService.js';

export const createUserController = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

export const loginUserController = async (req, res) => {
  const { email, encryptedPassword } = req.body;

  try {
    const user = await userService.loginUser(email, encryptedPassword);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, 'refresh');
    await userService.updateUser(user.id, { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};
