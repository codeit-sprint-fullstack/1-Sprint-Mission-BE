import {
  getMyInfo,
  updateMyInfo,
  updatePassword,
  getMyProducts,
  getMyFavoriteProducts,
} from "../services/userService";

export async function getMeController(req, res, next) {
  try {
    const result = await getMyInfo(req.id);

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function modifyMeController(req, res, next) {
  try {
    const result = await updateMyInfo({ userId: req.id, data: req.body });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function modifyPasswordController(req, res, next) {
  try {
    const result = await updatePassword({
      userId: req.id,
      password: req.body.password,
    });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyProductsController(req, res, next) {
  try {
    const result = await getMyProducts({ userId: req.id, query: req.query });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyFavoriteProductsController(req, res, next) {
  try {
    const result = await getMyFavoriteProducts({
      userId: req.id,
      query: req.query,
    });

    return res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}
