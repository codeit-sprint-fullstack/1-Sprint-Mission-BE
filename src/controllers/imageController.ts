import { Request, Response } from 'express';

const ERROR_MESSAGES = {
  UPLOAD_REQUIRED: '이미지를 업로드해 주세요.',
};

const imageUpload = (req: Request, res: Response): void => {
  const file = req.file as Express.MulterS3.File | undefined;

  if (!file) {
    res.status(400).json({ error: ERROR_MESSAGES.UPLOAD_REQUIRED });
    return;
  }

  const imageUrl = file.location;
  res.status(200).json({ url: imageUrl });
};

export default imageUpload;
