import * as freeBoardService from '../services/freeBoardService.js';
export const getFreeBoard = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
        const data = await freeBoardService.getFreeBoard({
            page,
            limit,
            keyword,
            sort,
        });
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getFreeBoardDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        const data = await freeBoardService.getFreeBoardDetail(id, userId);
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
export const postFreeBoard = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.auth?.userId;
        const data = await freeBoardService.postFreeBoard(title, content, tags, userId);
        res.status(201).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
export const editFreeBoard = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const data = await freeBoardService.editFreeBoard(title, content, id);
        res.status(201).json({
            data,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteFreeBoard = async (req, res, next) => {
    try {
        const { id } = req.params;
        await freeBoardService.deleteFreeBoard(id);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
};
