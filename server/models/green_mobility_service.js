"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityService = sequelize.define(
    "GreenMobilityService",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: true },
      imagePosition: { type: DataTypes.ENUM('left', 'right'), allowNull: false, defaultValue: 'left' },
      subtitle: { type: DataTypes.TEXT, allowNull: true },
      pointsJson: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of strings
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_services", underscored: true }
  );
  return GreenMobilityService;
};

