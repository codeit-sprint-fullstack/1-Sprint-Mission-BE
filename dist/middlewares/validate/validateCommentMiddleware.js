import { createError } from '../../utils/error.js';
const validateCommentMiddleware = (req, res, next) => {
    const { content } = req.body;
    if (!content || content.trim() === '') {
        {
            createError('내용이 없습니다', 400, 400);
        }
    }
    next();
};
export default validateCommentMiddleware;
