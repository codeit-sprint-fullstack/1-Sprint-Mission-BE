"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await queryInterface.sequelize.query(
      `SELECT id from "Products";`
    );
    const productRows = products[0];

    return queryInterface.bulkInsert("Images", [
      {
        id: uuidv4(),
        url: "https://s3-ap-northeast-1.amazonaws.com/thegate/2020/08/12/14/32/34/tokyotower.jpg",
        ProductId: productRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        url: "https://ko.skyticket.com/guide/wp-content/uploads/2021/07/55.png",
        ProductId: productRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Images", null, {});
  },
};
