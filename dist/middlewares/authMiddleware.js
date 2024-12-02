import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { CustomError_Class } from '../utils/error.js';
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;
const AuthMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new CustomError_Class('인증 헤더가 없습니다.', 401, 401));
    }
    const [tokenType, accessToken] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
        return next(new CustomError_Class('지원하지 않는 인증 방식입니다.', 400, 400));
    }
    if (!accessToken) {
        return next(new CustomError_Class('권한이 없습니다.', 400, 400));
    }
    jwt.verify(accessToken, secret, async (err, decoded) => {
        if (err) {
            return next(new CustomError_Class('다시 로그인해 주세요.', 401, 401));
        }
        try {
            const decodedPayload = decoded;
            const user = await prisma.user.findUnique({
                where: { id: decodedPayload?.userId },
            });
            if (!user) {
                return next(new CustomError_Class('회원 정보가 없습니다.', 404, 404));
            }
            req.user = user;
            return next();
        }
        catch (err) {
            return next(new CustomError_Class('서버 오류입니다.', 500, 500));
        }
    });
};
export default AuthMiddleware;
