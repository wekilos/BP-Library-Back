"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Category.hasMany(models.CategoryItem);
    }
  }
  Category.init(
    {
      order_num: DataTypes.INTEGER,
      card_type: DataTypes.STRING,
      icon: DataTypes.TEXT,
      icon_white: DataTypes.TEXT,
      name_tm: DataTypes.TEXT,
      name_ru: DataTypes.TEXT,
      name_en: DataTypes.TEXT,
      link: DataTypes.TEXT,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
