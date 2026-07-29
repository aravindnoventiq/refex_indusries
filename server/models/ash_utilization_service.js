"use strict";

module.exports = (sequelize, DataTypes) => {
  const AshUtilizationService = sequelize.define(
    "AshUtilizationService",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: true },
      imagePosition: { type: DataTypes.ENUM('left', 'right'), allowNull: false, defaultValue: 'left' },
      intro: { type: DataTypes.TEXT, allowNull: true },
      subtitle: { type: DataTypes.TEXT, allowNull: true },
      pointsJson: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of strings
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "ash_utilization_services", underscored: true }
  );
  return AshUtilizationService;
};

