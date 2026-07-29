"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityHero = sequelize.define(
    "GreenMobilityHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      slides: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of { image: string }
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_hero", underscored: true }
  );
  return GreenMobilityHero;
};

