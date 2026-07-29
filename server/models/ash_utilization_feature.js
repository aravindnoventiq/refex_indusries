"use strict";

module.exports = (sequelize, DataTypes) => {
  const AshUtilizationFeature = sequelize.define(
    "AshUtilizationFeature",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "ash_utilization_features", underscored: true }
  );
  return AshUtilizationFeature;
};

