const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

module.exports = Category;
