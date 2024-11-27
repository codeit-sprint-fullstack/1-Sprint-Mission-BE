import { Request, Response, NextFunction } from "express";

import userService from "../services/user-service";

async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = res.locals.userId;
    const userInfo = await userService.getUser(userId);

    res.status(200).send(userInfo);
  } catch (err) {
    next(err);
  }
}

async function modifyUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = res.locals.userId;
    const { nickname, image, password } = req.body;
    const userInfo = await userService.modifyUser({
      userId,
      nickname,
      image,
      password,
    });

    res.status(200).send(userInfo);
  } catch (err) {
    next(err);
  }
}

export default { getUser, modifyUser };
