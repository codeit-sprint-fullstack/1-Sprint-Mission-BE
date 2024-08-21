import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 중고템 등록
export const createMarketItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const marketItem = await prisma.marketItem.create({
    data: { name, description, price },
  });
  res.status(201).json(marketItem);
});

// 중고템 조회
export const getMarketItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const marketItem = await prisma.marketItem.findUnique({
    where: { id: parseInt(id) },
  });
  if (marketItem) {
    res.status(200).json(marketItem);
  } else {
    res.status(404).json({ error: "Market Item not found" });
  }
});

// 중고템 수정
export const updateMarketItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const marketItem = await prisma.marketItem.update({
    where: { id: parseInt(id) },
    data: { name, description, price },
  });
  res.status(200).json(marketItem);
});

// 중고템 삭제
export const deleteMarketItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.marketItem.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

// 중고템 목록 조회
export const listMarketItems = asyncHandler(async (req, res) => {
  const { page = 1, size = 10, sort = "createdAt", search = "" } = req.query;
  const skip = (page - 1) * size;
  const marketItems = await prisma.marketItem.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
    skip: parseInt(skip),
    take: parseInt(size),
    orderBy: { [sort]: "desc" },
  });
  res.status(200).json(marketItems);
});
