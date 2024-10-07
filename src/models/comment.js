const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "UserId" });
      Comment.belongsTo(models.Product, { foreignKey: "ProductId" });
      Comment.belongsTo(models.Article, { foreignKey: "ArticleId" });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ArticleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Articles",
          key: "id",
        },
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Products",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
    }
  );

  return Comment;
};
