"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityImpact = sequelize.define(
    "GreenMobilityImpact",
    {
      number: { type: DataTypes.STRING, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_impacts", underscored: true }
  );
  return GreenMobilityImpact;
};

