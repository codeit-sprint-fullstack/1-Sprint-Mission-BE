import { Request, Response } from 'express';
import imageUpload from '../controllers/imageController';

describe('Image Upload Controller', () => {
  it('should return an error if no file is uploaded', () => { // 파일이 업로드되지 않으면 오류를 반환해야함
    const req = {
      file: undefined,
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    imageUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: '이미지를 업로드해주세요.' });
  });

  it('should return the image URL if a file is uploaded', () => { // 파일이 업로드되면 이미지 URL을 반환해야함
    const req = {
      file: {
        location: 'https://panda.com/ibao-image.jpg',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    imageUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ url: 'https://panda.com/ibao-image.jpg' });
  });
});

