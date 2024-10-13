import * as productService from '../services/productService.js';
import { CreateProduct, PatchProduct, assert } from '../validations/structs.js';

export const getProductList = async (req, res) => {
  const { orderBy } = req.query;
  const page = parseInt(req.query.page) * 1 || 1;
  const pageSize = parseInt(req.query.pageSize) * 1 || 10;
  const keyword = req.query.keyword || '';

  const products = await productService.getProducts({
    orderBy,
    page,
    pageSize,
    keyword,
  });

  res.json(products);
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const product = await productService.getProduct(productId, userId);
  res.json(product);
};

export const createProduct = async (req, res) => {
  const userId = req.user.id;
  const { name, description, price } = req.body;
  const files = req.files;

  let tags = req.body.tags;

  if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ message: '이미지 파일이 안옴' });
  }

  const convertToUrl =
    files && files.length > 0
      ? files.map((file) => {
          return `${req.protocol}://${req.get('host')}/api/images/${
            file.filename
          }`;
        })
      : [];

  const data = {
    name,
    description,
    price: price ? parseInt(price, 10) : 0,
    tags,
    images: [...convertToUrl],
  };

  assert(data, CreateProduct);

  const newProduct = await productService.createProduct(userId, data);
  res.status(201).json(newProduct);
};

export const updateProductById = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price } = req.body;
  const files = req.files;
  let tags = req.body.tags;
  let imageUrls = req.body.imageUrls;

  if (!Array.isArray(tags)) {
    tags = tags ? [tags] : [];
  }

  if (!Array.isArray(imageUrls)) {
    imageUrls = imageUrls ? [imageUrls] : [];
  }

  if (!files && files.length === 0 && imageUrls.length === 0) {
    return res
      .status(400)
      .json({ message: '이미지 파일이나 원래 저장된 url 아무것도 안옴' });
  }

  const convertToUrl =
    files && files.length > 0
      ? files.map((file) => {
          return `${req.protocol}://${req.get('host')}/api/images/${
            file.filename
          }`;
        })
      : [];

  const data = {
    name,
    description,
    price: price ? parseInt(price, 10) : 0,
    tags,
    images:
      imageUrls.length === 0
        ? [...convertToUrl]
        : [...convertToUrl, ...imageUrls],
  };

  console.log(data);

  assert(data, PatchProduct);

  const product = await productService.updateProduct(productId, data);
  return res.json(product);
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;
  await productService.deleteProduct(productId);
  return res.status(204).json({ message: '게시글이 삭제되었습니다' });
};

export const createFavoriteOnProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const product = await productService.createFavorite(productId, userId);
  return res.json(product);
};

export const deleteFavoriteOnProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const product = await productService.deleteFavorite(productId, userId);
  return res.json(product);
};
