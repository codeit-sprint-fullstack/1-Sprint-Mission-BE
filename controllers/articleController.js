import * as articleService from "../services/articleService.js";

export const createArticle = async (req, res) => {
  const { image, content, title } = req.body;
  try {
    const userId = req.user.id;
    const newArticle = await articleService.createArticle(
      image,
      content,
      title,
      userId
    );
    const response = {
      id: newArticle.id,
      title: newArticle.title,
      content: newArticle.content,
      image: newArticle.image,
      likeCount: newArticle.likeCount,
      createdAt: newArticle.createdAt,
      updatedAt: newArticle.updatedAt,
      writer: {
        nickname: newArticle.writer.nickname,
        id: newArticle.writer.id,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Failed to create article", error });
  }
};

export const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;

    const { list, totalCount } = await articleService.getArticles(
      parseInt(page),
      parseInt(pageSize),
      keyword,
      orderBy
    );
    const responseList = list.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.image,
      likeCount: article.likeCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      writer: {
        nickname: article.writer.nickname,
        id: article.writer.id,
      },
    }));

    res.status(200).json({
      list: responseList,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch articles", error: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await articleService.getArticleById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    const responseList = {
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.image,
      likeCount: article.likeCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      writer: {
        nickname: article.writer.nickname,
        id: article.writer.id,
      },
    };

    res.status(200).json(responseList);
  } catch (error) {
    console.error("Error fetching article:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch article", error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { image, title, content } = req.body;

    const updatedArticle = await articleService.updateArticle(
      articleId,
      image,
      title,
      content
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article", error });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    await articleService.deleteArticle(articleId);

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const addLike = async (req, res) => {
  try {
    const { articleId } = req.params;
    const addLike = await articleService.addLike(articleId);

    res.status(200).json(addLike);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { articleId } = req.params;
    const deleteLike = await articleService.deleteLike(articleId);

    res.status(200).json(deleteLike);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({
      message: "Failed to delete favorite",
      error: error.message,
    });
  }
};
