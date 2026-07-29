"use strict";

module.exports = (sequelize, DataTypes) => {
  const AshUtilizationHero = sequelize.define(
    "AshUtilizationHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      slides: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of { image: string }
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "ash_utilization_hero", underscored: true }
  );
  return AshUtilizationHero;
};

