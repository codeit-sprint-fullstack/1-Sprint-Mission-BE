import { signUp, signIn } from '../controllers/authController';
import { Request, Response } from 'express';

const createRequest = (body: object): Request => {
  return { body } as Request;
};

const createResponse = (): Response => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
};

describe('Auth Controller', () => {
  const testUser = {
    email: 'minseo503@naver.com',
    password: '12341234',
    nickname: 'ibao',
  };

  it('should only allow a user to sign up with valid information', async () => { // 사용자는 유효한 정보로만 가입할 수 있어야함
    const req = createRequest(testUser);
    const res = createResponse();

    await signUp(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('should allow a user to sign in only with correct credentials', async () => { // 사용자는 올바른 정보로만 로그인할 수 있어야함
    const req = createRequest({
      email: testUser.email,
      password: testUser.password,
    });
    const res = createResponse();

    await signIn(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});

