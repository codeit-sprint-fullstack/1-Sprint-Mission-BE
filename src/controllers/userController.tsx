import * as userService from '../services/userService.js';
import redis from 'redis';
import { Request, Response, NextFunction } from 'express';

const redisClient = redis.createClient();

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUsers();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserDetail(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.editUser(id, req);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, encryptedPassword } = req.body;

  try {
    const user = await userService.loginUser(email, encryptedPassword);

    const accessToken = userService.createToken(user, 'newToken');

    const refreshToken = userService.createToken(user, 'refresh');

    // redisClient.set(user.id, refreshToken, 'EX', 7 * 24 * 60 * 60);

    await userService.updateUser(user.id, { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const updateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    const userId: any = req.auth?.userId;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(
      userId,
      refreshToken
    );
    await userService.updateUser(userId, { refreshToken: newRefreshToken });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(201).json({ newAccessToken });
  } catch (error) {
    return next(error);
  }
};
