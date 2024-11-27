import { Request, Response, NextFunction } from "express";

import imageService from "../services/image-service";
import { CustomError } from "../utils/error";

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let result;

    if (req.file) {
      result = await imageService.uploadGoogleCloud(req.file);
    } else {
      throw new CustomError(40067);
    }

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

export default { uploadImage };
