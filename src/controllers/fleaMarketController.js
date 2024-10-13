import * as fleaMarketService from '../services/fleaMarketService.js';

export const getFleaMarket = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
    const { userId } = req.body;

    const data = await fleaMarketService.getFleaMarket(
      page,
      limit,
      keyword,
      sort,
      userId
    );

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFleaMarketDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const data = await fleaMarketService.getFleaMarketDetail(id, userId);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFleaMarket = async (req, res, next) => {
  try {
    const { id } = req.params;

    await fleaMarketService.deleteFleaMarket(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const postFleaMarket = async (req, res, next) => {
  try {
    const { price, title, content, tags } = req.body;
    const { userId } = req.auth;

    const data = await fleaMarketService.postFleaMarket(
      price,
      title,
      content,
      tags,
      userId,
      req
    );

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const editFleaMarket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price, title, content, tags } = req.body;
    const { userId } = req.auth;

    const data = await fleaMarketService.editFleaMarket(
      price,
      title,
      content,
      tags,
      userId,
      id,
      req
    );

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
