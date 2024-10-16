"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );
    const userRows = users[0];

    return queryInterface.bulkInsert("Articles", [
      {
        id: 1,
        title: "시청요",
        content: "첫글",
        image:
          "https://ojsfile.ohmynews.com/STD_IMG_FILE/2022/0712/IE003019271_STD.jpg",
        likeCount: 10,
        UserId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "시청요",
        content: "둘째글",
        image:
          "https://ojsfile.ohmynews.com/STD_IMG_FILE/2022/0712/IE003019271_STD.jpg",
        likeCount: 12,
        UserId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Articles", null, {});
  },
};
