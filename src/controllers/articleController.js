const { Article, User, Comment } = require("../models");

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
        {
          model: Comment,
          attributes: ["content"],
        },
      ],
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findOne({
      where: { id: articleId },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["content"],
        },
      ],
    });
    if (!article) {
      return res.status(404).json({ message: "기사를 찾을 수 없습니다." });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

exports.createArticle = async (req, res) => {
  const { title, content, image } = req.body;
  const userId = req.user.id;
  try {
    const newArticle = await Article.create({
      title,
      content,
      image,
      UserId: userId,
    });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "기사 생성 실패", error });
  }
};

exports.updateArticle = async (req, res) => {
  const { articleId } = req.params;
  const { title, content, image } = req.body;
  try {
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: "기사를 찾을 수 없습니다." });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.image = image || article.image;
    await article.save();

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "기사 수정 실패", error });
  }
};

exports.deleteArticle = async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: "기사를 찾을 수 없습니다." });
    }
    await article.destroy();
    res.status(200).json({ message: "기사 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "기사 삭제 실패", error });
  }
};
