import * as articleService from "../services/articleService";
import prisma from "../models/index";

jest.mock("../models/index", () => ({
  article: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  favorite: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe("Article Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should return a paginated list of articles", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Article 1",
          content: "Content 1",
          images: [],
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          writer: {
            id: 1,
            nickname: "User1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          favorites: [],
        },
      ];
      const mockTotalCount = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockArticles,
        mockTotalCount,
      ]);

      const result = await articleService.getArticles(1, 10, "", "recent");

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.list).toEqual(mockArticles);
      expect(result.totalCount).toBe(mockTotalCount);
    });
  });

  describe("createArticle", () => {
    it("should create a new article", async () => {
      const mockArticle = {
        id: 1,
        title: "New Article",
        content: "New Content",
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: {
          id: 1,
          nickname: "User1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        favorites: [],
      };

      (prisma.article.create as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.createArticle(
        [],
        "New Content",
        "New Article",
        1
      );

      expect(prisma.article.create).toHaveBeenCalled();
      expect(result).toEqual(mockArticle);
    });
  });

  describe("getArticleById", () => {
    it("should return an article by ID", async () => {
      const mockArticle = {
        id: 1,
        title: "Article 1",
        content: "Content 1",
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: {
          id: 1,
          nickname: "User1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        favorites: [{ id: 1, userId: 1, articleId: 1 }],
      };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.getArticleById({
        articleId: 1,
        userId: 1,
      });

      expect(prisma.article.findUnique).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.isLiked).toBe(true);
    });

    it("should throw an error if the article is not found", async () => {
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        articleService.getArticleById({ articleId: 1, userId: 1 })
      ).rejects.toThrow("Article not found");
    });
  });

  describe("updateArticle", () => {
    it("should update an article", async () => {
      const mockArticle = {
        id: 1,
        title: "Updated Article",
        content: "Updated Content",
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: {
          id: 1,
          nickname: "User1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        favorites: [],
      };

      (prisma.article.update as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.updateArticle(
        1,
        1,
        [],
        "Updated Article",
        "Updated Content"
      );

      expect(prisma.article.update).toHaveBeenCalled();
      expect(result.title).toBe("Updated Article");
    });
  });

  describe("deleteArticle", () => {
    it("should delete an article", async () => {
      (prisma.article.delete as jest.Mock).mockResolvedValue({});

      await articleService.deleteArticle(1);

      expect(prisma.article.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("addLike", () => {
    it("should add a like to an article", async () => {
      const mockArticle = {
        id: 1,
        title: "Article 1",
        content: "Content 1",
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: {
          id: 1,
          nickname: "User1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        favorites: [{ id: 1, userId: 1, articleId: 1 }],
        likeCount: 1,
      };

      (prisma.favorite.create as jest.Mock).mockResolvedValue({});
      (prisma.article.update as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.addLike({ articleId: 1, userId: 1 });

      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: { articleId: 1, userId: 1 },
      });
      expect(result.likeCount).toBe(1);
    });
  });

  describe("deleteLike", () => {
    it("should remove a like from an article", async () => {
      const mockArticle = {
        id: 1,
        title: "Article 1",
        content: "Content 1",
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        writer: {
          id: 1,
          nickname: "User1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        favorites: [],
        likeCount: 0,
      };

      (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.article.update as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.deleteLike({
        articleId: 1,
        userId: 1,
      });

      expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({
        where: { articleId: 1, userId: 1 },
      });
      expect(result.likeCount).toBe(0);
    });
  });
});
