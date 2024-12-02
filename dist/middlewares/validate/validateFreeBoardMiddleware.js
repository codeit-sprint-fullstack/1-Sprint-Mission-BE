import { createError } from '../../utils/error.js';
const validateFreeBoardMiddleware = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || title.trim() === '') {
        createError('제목이 없습니다', 400, 400);
    }
    if (!content || content.trim() === '') {
        {
            createError('내용이 없습니다', 400, 400);
        }
    }
    next();
};
export default validateFreeBoardMiddleware;
