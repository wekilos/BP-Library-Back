"use strict";

const { INTEGER } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CategoryItems", {
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
        defaultValue: "string",
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
      text_tm: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      text_ru: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      text_en: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      publishing: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      placeholder: {
        type: Sequelize.STRING,
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
      CategoryId: {
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
    await queryInterface.dropTable("CategoryItems");
  },
};
