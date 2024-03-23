const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const UserCategory = sequelize.define(
  "UserCategory",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {}
);

module.exports = UserCategory;
