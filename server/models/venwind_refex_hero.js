"use strict";

module.exports = (sequelize, DataTypes) => {
  const VenwindRefexHero = sequelize.define(
    "VenwindRefexHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "venwind_refex_hero", underscored: true }
  );
  return VenwindRefexHero;
};

