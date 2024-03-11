"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryItemFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryItemFile.belongsTo(models.CategoryItem);
    }
  }
  CategoryItemFile.init(
    {
      name: DataTypes.STRING,
      filename: DataTypes.STRING,
      filetype: DataTypes.STRING,
      placeholder: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "CategoryItemFile",
    }
  );
  return CategoryItemFile;
};
