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

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.article.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }],
          include: { writer: true, favorites: true },
        }),
        prisma.article.count({ where: {} }),
      ]);
      expect(result.list).toEqual(mockArticles);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle keyword search", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Search Result",
          content: "Matched Content",
          images: [],
          userId: 1,
          writer: { id: 1, nickname: "User1" },
          favorites: [],
        },
      ];
      const mockTotalCount = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockArticles,
        mockTotalCount,
      ]);

      const result = await articleService.getArticles(
        1,
        10,
        "Search",
        "recent"
      );

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.article.findMany({
          where: {
            OR: [
              { title: { contains: "Search", mode: "insensitive" } },
              { content: { contains: "Search", mode: "insensitive" } },
            ],
          },
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }],
          include: { writer: true, favorites: true },
        }),
        prisma.article.count({
          where: {
            OR: [
              { title: { contains: "Search", mode: "insensitive" } },
              { content: { contains: "Search", mode: "insensitive" } },
            ],
          },
        }),
      ]);
      expect(result.list).toEqual(mockArticles);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle favorite order", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Popular Article",
          likeCount: 10,
          favorites: [], // 명시적으로 빈 배열 설정
          writer: { id: 1, nickname: "User1" },
        },
      ];
      const mockTotalCount = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockArticles,
        mockTotalCount,
      ]);

      const result = await articleService.getArticles(1, 10, "", "favorite");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.article.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }],
          include: { writer: true, favorites: true },
        }),
        prisma.article.count({ where: {} }),
      ]);
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

      expect(prisma.article.create).toHaveBeenCalledWith({
        data: {
          images: [],
          content: "New Content",
          title: "New Article",
          userId: 1,
        },
        include: {
          writer: true,
          favorites: {
            where: { userId: 1 },
            select: { id: true, userId: true, articleId: true },
          },
        },
      });
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

      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          writer: true,
          favorites: {
            where: { userId: 1 },
            select: { id: true, userId: true, articleId: true },
          },
        },
      });
      expect(result.id).toBe(1);
      expect(result.isLiked).toBe(true);
    });

    it("should return an article by ID with isLiked set to true if favorited", async () => {
      const mockArticle = {
        id: 1,
        title: "Article 1",
        content: "Content",
        favorites: [{ id: 1 }],
        writer: { id: 1, nickname: "User1" },
      };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.getArticleById({
        articleId: 1,
        userId: 1,
      });

      expect(result.isLiked).toBe(true);
    });

    it("should return an article by ID with isLiked set to false if not favorited", async () => {
      const mockArticle = {
        id: 1,
        title: "Article 1",
        content: "Content",
        favorites: [],
        writer: { id: 1, nickname: "User1" },
      };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.getArticleById({
        articleId: 1,
        userId: 1,
      });

      expect(result.isLiked).toBe(false);
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
        writer: {
          id: 1,
          nickname: "User1",
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

    it("should add a like", async () => {
      const mockArticle = {
        id: 1,
        title: "Liked Article",
        content: "Content",
        likeCount: 1,
        favorites: [{ id: 1, userId: 1, articleId: 1 }],
      };

      (prisma.favorite.create as jest.Mock).mockResolvedValue({});
      (prisma.article.update as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.addLike({ articleId: 1, userId: 1 });

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

    it("should remove a like", async () => {
      const mockArticle = {
        id: 1,
        title: "Article",
        content: "Content",
        likeCount: 0,
        favorites: [],
      };

      (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.article.update as jest.Mock).mockResolvedValue(mockArticle);

      const result = await articleService.deleteLike({
        articleId: 1,
        userId: 1,
      });

      expect(result.likeCount).toBe(0);
    });
  });
});
