const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, { foreignKey: "UserId" });
      Article.hasMany(models.Comment, { foreignKey: "ArticleId" });
    }
  }

  Article.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
    }
  );

  return Article;
};
