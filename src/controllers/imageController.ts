import { Request, Response } from 'express';
import generatePresignedUrl from '../utils/multer';

const ERROR_MESSAGES = {
  UPLOAD_REQUIRED: '이미지를 업로드해 주세요.',
};

const imageUpload = async (req: Request, res: Response): Promise<void> => {
  const fileName = req.body.fileName; // 아이바오마켓에서 파일 이름을 받아올 예정

  if (!fileName) {
    res.status(400).json({ error: ERROR_MESSAGES.UPLOAD_REQUIRED });
    return;
  }

  try {
    const presignedUrl = await generatePresignedUrl(fileName);
    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json({ error: 'URL 생성 중 오류 발생' });
  }
};

export default imageUpload;

