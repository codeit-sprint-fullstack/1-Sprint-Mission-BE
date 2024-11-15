import * as productService from "../services/productService";
import { Request, Response, NextFunction } from "express";

export const createProduct = async (
  req: Request & {
    files?: Express.Multer.File[];
    user?: { id: number; nickname: string };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, user } = req;

    // user와 files가 존재하는지 확인
    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const images = files ? files.map((file) => (file as any).location) : [];
    const { name, price, description, tags } = req.body as {
      name: string;
      price: string;
      description: string;
      tags: string[];
    };
    const { id: userId, nickname: userNickname } = user;

    const newProduct = await productService.createProduct({
      images,
      name,
      price: parseInt(price),
      description,
      tags,
      userId,
      userNickname,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      pageSize = "10",
      keyword = "",
      orderBy = "recent",
    } = req.query as {
      page?: string;
      pageSize?: string;
      keyword?: string;
      orderBy?: string;
    };

    const { list, totalCount } = await productService.getProducts(
      parseInt(page),
      parseInt(pageSize),
      keyword,
      orderBy
    );

    res.status(200).json({ list, totalCount });
  } catch (error) {
    next(error);
  }
};

export const getProductsById = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (typeof userId !== "number") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const productId = parseInt(req.params.productId);
    const product = await productService.getProductById({ productId, userId });
    res.status(200).json(product);
  } catch (err) {
    next(Error);
  }
};

export const updateProduct = async (
  req: Request & {
    files?: Express.Multer.File[];
    user?: { id: number; nickname: string };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { files, user } = req;
    const { productId } = req.params;
    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId: number = user.id;
    const userNickname: string = user.nickname;
    const newImagePaths = files
      ? files.map((file) => (file as any).location)
      : [];

    let existingImages: string[] = [];
    if (req.body["existingImages"]) {
      if (Array.isArray(req.body["existingImages"])) {
        existingImages = req.body["existingImages"];
      } else {
        existingImages = [req.body["existingImages"]];
      }
    }

    const images = [...existingImages, ...newImagePaths];
    const { name, price, description, tags } = req.body as {
      name: string;
      price: string;
      description: string;
      tags: string[];
    };

    const updatedProduct = await productService.updateProduct({
      productId: parseInt(productId),
      images,
      name,
      price: parseInt(price),
      description,
      tags,
      userId,
      userNickname,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    await productService.deleteProduct(parseInt(productId));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (typeof userId !== "number") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const productId = parseInt(req.params.productId);
    const product = productService.addFavorite({ productId, userId });
    res.status(200).json(product);
  } catch (err) {
    next(Error);
  }
};

export const deleteFavorite = async (
  req: Request & { user?: { id: number } },
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (typeof userId !== "number") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const productId = parseInt(req.params.productId);
    const product = productService.deleteFavorite({ productId, userId });
    res.status(200).json(product);
  } catch (err) {
    next(Error);
  }
};
