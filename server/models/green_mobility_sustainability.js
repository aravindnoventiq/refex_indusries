"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilitySustainability = sequelize.define(
    "GreenMobilitySustainability",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      additionalText: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_sustainability", underscored: true }
  );
  return GreenMobilitySustainability;
};

