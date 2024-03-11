"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CategoryItemFiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      filetype: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      placeholder: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      CategoryItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CategoryItemFiles");
  },
};
