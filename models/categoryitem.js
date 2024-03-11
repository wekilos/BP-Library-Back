"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryItem.belongsTo(models.Category);
      CategoryItem.hasMany(models.CategoryItemFile);
    }
  }
  CategoryItem.init(
    {
      order_num: DataTypes.INTEGER,
      card_type: DataTypes.STRING,
      icon: DataTypes.TEXT,
      icon_white: DataTypes.TEXT,
      name_tm: DataTypes.TEXT,
      name_ru: DataTypes.TEXT,
      name_en: DataTypes.TEXT,
      text_tm: DataTypes.TEXT,
      text_ru: DataTypes.TEXT,
      text_en: DataTypes.TEXT,
      author: DataTypes.STRING,
      year: DataTypes.STRING,
      publishing: DataTypes.STRING,
      placeholder: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CategoryItem",
    }
  );
  return CategoryItem;
};
