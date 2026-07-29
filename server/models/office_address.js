"use strict";

module.exports = (sequelize, DataTypes) => {
  const OfficeAddress = sequelize.define(
    "OfficeAddress",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.JSON, allowNull: false }, // Array of strings
      image: { type: DataTypes.TEXT, allowNull: true },
      isTopOffice: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // true for top row, false for bottom row
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "office_address", underscored: true }
  );
  return OfficeAddress;
};

