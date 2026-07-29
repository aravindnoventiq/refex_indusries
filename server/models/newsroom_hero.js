"use strict";

module.exports = (sequelize, DataTypes) => {
  const NewsroomHero = sequelize.define(
    "NewsroomHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "newsroom_hero", underscored: true }
  );
  return NewsroomHero;
};

