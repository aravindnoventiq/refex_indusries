"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityBrandValue = sequelize.define(
    "GreenMobilityBrandValue",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_brand_values", underscored: true }
  );
  return GreenMobilityBrandValue;
};

