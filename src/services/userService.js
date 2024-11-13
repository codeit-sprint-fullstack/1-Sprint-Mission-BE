import userRepository from "../repositories/userRepository";
import { createHashedPassword } from "../utils/authUtil";

export async function getMyInfo(userId) {
  return await userRepository.getMyInfoByUserId(userId);
}

export async function updateMyInfo({ userId, data }) {
  return await userRepository.updateMyInfoByUserId({ userId, data });
}

export async function updatePassword({ userId, password }) {
  const newHashedPassword = await createHashedPassword(password);
  return await userRepository.updateUserPasswordByUserId({
    userId,
    newHashedPassword,
  });
}

export async function getMyProducts({ userId, query }) {
  const { keyword = "" } = query;
  const userProductsPromise = await userRepository.getMyProductsByQuery({
    userId,
    query,
  });
  const totalCountPromise =
    await userRepository.getMyProductsByKeywordTotalCount(keyword);
  const [userProducts, totalCount] = await Promise.all([
    userProductsPromise,
    totalCountPromise,
  ]);
  const transformedUserProducts = userProducts.Product.map((product) =>
    productForm(product)
  );

  return { totalCount, products: transformedUserProducts };
}

export async function getMyFavoriteProducts({ userId, query }) {
  const { keyword = "" } = query;
  const userProductsPromise = await userRepository.getMyFavoriteProductsByQuery(
    {
      userId,
      query,
    }
  );
  const totalCountPromise =
    await userRepository.getMyProductsByKeywordTotalCount(keyword);
  const [userProducts, totalCount] = await Promise.all([
    userProductsPromise,
    totalCountPromise,
  ]);
  const transformedUserProducts = userProducts.Product.map((product) =>
    productForm(product)
  );

  return { totalCount, products: transformedUserProducts };
}
