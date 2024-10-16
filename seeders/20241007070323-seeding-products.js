"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );
    const userRows = users[0];

    return queryInterface.bulkInsert("Products", [
      {
        id: uuidv4(),
        name: "맥북",
        description: "시딩1",
        price: 10000000,
        images: [
          "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/refurb-mbp16touch-silver-gallery-2019_GEO_KR?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1582233078186",
        ],
        tags: ["전자제품", "맥북"],
        favoriteCount: 5,
        UserId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "맥북",
        description: "시딩2",
        price: 20000000,
        images: [
          "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/refurb-mbp16touch-silver-gallery-2019_GEO_KR?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1582233078186",
        ],
        tags: ["전자제품", "맥북"],
        favoriteCount: 5,
        UserId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Products", null, {});
  },
};
