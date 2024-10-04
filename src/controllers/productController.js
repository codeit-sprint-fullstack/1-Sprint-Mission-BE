import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";

import { CreateProduct, PatchProduct } from "../validation/structs.js";

const prisma = new PrismaClient();

//get products list
// query parameter: orderBy, page, pageSize, keyword
export const getProducts = async (req, res) => {
  const { orderBy } = req.query;
  const page = parseInt(req.query.page) * 1 || 1;
  const pageSize = parseInt(req.query.pageSize) * 1 || 10;
  const keyword = req.query.keyword || "";

  const offset = (page - 1) * pageSize;

  let sortOption;
  if (orderBy === "recent") {
    sortOption = { createdAt: "desc" };
  } else if (orderBy === "favorite") {
    sortOption = { favoriteCount: "desc" };
  } else {
    sortOption = { createdAt: "asc" };
  }

  const searchQuery = {
    OR: [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ],
  };

  const products = await prisma.product.findMany({
    where: searchQuery,
    orderBy: sortOption,
    skip: offset,
    take: pageSize,
  });

  const totalCount = await prisma.product.count({ where: searchQuery });

  res.json({ totalCount, list: products });
};

//get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });

  res.json(product);
};

// create new product
export const createProduct = async (req, res) => {
  assert(req.body, CreateProduct);
  const newProduct = await prisma.product.create({
    data: req.body,
  });
  res.status(201).json(newProduct);
};

// patch existed product with id
export const updateProductById = async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.json(product);
};

// delete a product by id
export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });

  res.status(200).json({ message: "Product has deleted successfully" });
};
