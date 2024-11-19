import * as commentService from "../services/commentService";
import prisma from "../models/index";

jest.mock("../models/index", () => ({
  comment: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Comment Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProductComment", () => {
    it("should create a comment for a product", async () => {
      const mockComment = {
        id: 1,
        content: "Great product!",
        writer: { id: 1, nickname: "User1" },
        product: { id: 1 },
      };

      (prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

      const result = await commentService.createProductComment(
        "Great product!",
        1,
        "1"
      );

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: "Great product!",
          writer: { connect: { id: 1 } },
          product: { connect: { id: 1 } },
        },
        include: { writer: true },
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe("createArticleComment", () => {
    it("should create a comment for an article", async () => {
      const mockComment = {
        id: 1,
        content: "Great article!",
        writer: { id: 1, nickname: "User1" },
        article: { id: 1 },
      };

      (prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

      const result = await commentService.createArticleComment(
        "Great article!",
        1,
        "1"
      );

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: "Great article!",
          writer: { connect: { id: 1 } },
          article: { connect: { id: 1 } },
        },
        include: { writer: true },
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe("getProductComments", () => {
    it("should retrieve comments for a product", async () => {
      const mockComments = [
        {
          id: 1,
          content: "Great product!",
          writer: { id: 1, nickname: "User1" },
        },
      ];

      (prisma.comment.findMany as jest.Mock).mockResolvedValue(mockComments);

      const result = await commentService.getProductComments(10, "", "1");

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { writer: true },
        where: { productId: 1 },
      });
      expect(result.list).toEqual(mockComments);
      expect(result.nextCursor).toBeNull();
    });
  });

  describe("getArticleComments", () => {
    it("should retrieve comments for an article", async () => {
      const mockComments = [
        {
          id: 1,
          content: "Interesting article!",
          writer: { id: 1, nickname: "User1" },
        },
      ];

      (prisma.comment.findMany as jest.Mock).mockResolvedValue(mockComments);

      const result = await commentService.getArticleComments(10, "", "1");

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { writer: true },
        where: { articleId: 1 },
      });
      expect(result.list).toEqual(mockComments);
      expect(result.nextCursor).toBeNull();
    });
  });

  describe("updateComment", () => {
    it("should update a comment", async () => {
      const mockUpdatedComment = {
        id: 1,
        content: "Updated comment content",
        writer: { id: 1, nickname: "User1" },
      };

      (prisma.comment.update as jest.Mock).mockResolvedValue(
        mockUpdatedComment
      );

      const result = await commentService.updateComment(
        "1",
        "Updated comment content"
      );

      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { content: "Updated comment content" },
        include: { writer: true },
      });
      expect(result).toEqual(mockUpdatedComment);
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment", async () => {
      (prisma.comment.delete as jest.Mock).mockResolvedValue({});

      await commentService.deleteComment("1");

      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
