"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgHrItem = sequelize.define(
    "EsgHrItem",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      link: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_hr_item", underscored: true }
  );
  return EsgHrItem;
};

