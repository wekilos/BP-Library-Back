"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      card_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "path",
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      icon_white: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      name_tm: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      name_ru: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      name_en: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("Categories");
  },
};
