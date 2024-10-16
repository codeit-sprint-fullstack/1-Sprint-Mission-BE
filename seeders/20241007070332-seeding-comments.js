"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );
    const userRows = users[0];

    const products = await queryInterface.sequelize.query(
      `SELECT id from "Products";`
    );
    const productRows = products[0];

    return queryInterface.bulkInsert("Comments", [
      {
        id: 1,
        content: "맥북요",
        ProductId: productRows[0].id,
        UserId: userRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        content: "시청요",
        ArticleId: 1,
        UserId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
