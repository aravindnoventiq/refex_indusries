"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgProgram = sequelize.define(
    "EsgProgram",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_program", underscored: true }
  );
  return EsgProgram;
};

