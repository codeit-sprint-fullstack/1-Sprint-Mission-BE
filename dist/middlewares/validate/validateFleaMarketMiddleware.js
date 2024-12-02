import { CustomError_Class } from '../../utils/error.js';
const validateFleaMarketMiddleware = (req, res, next) => {
    const { title, content, price } = req.body;
    if (!title || title.trim() === '') {
        return next(new CustomError_Class('상품 이름은 필수입니다.', 400, 400));
    }
    if (!content || content.trim() === '') {
        return next(new CustomError_Class('상품 설명은 필수입니다.', 400, 400));
    }
    if (!price || price.trim() === '' || price <= 0) {
        return next(new CustomError_Class('상품 가격은 0 이상이어야 합니다.', 400, 400));
    }
    next();
};
export default validateFleaMarketMiddleware;
