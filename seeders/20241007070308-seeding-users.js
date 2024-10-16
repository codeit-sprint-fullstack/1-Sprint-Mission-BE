"use strict";
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        email: "user1@codeit.com",
        password: await bcrypt.hash("qwer123", 10),
        nickname: "1번",
        image: "https://example.com/user1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        email: "user2@codeit.com",
        password: await bcrypt.hash("qwer123", 10),
        nickname: "2번",
        image: "https://example.com/user1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
