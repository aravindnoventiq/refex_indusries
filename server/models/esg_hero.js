"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgHero = sequelize.define(
    "EsgHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description1: { type: DataTypes.TEXT, allowNull: true },
      description2: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      button1Text: { type: DataTypes.STRING, allowNull: true },
      button1Link: { type: DataTypes.STRING, allowNull: true },
      button2Text: { type: DataTypes.STRING, allowNull: true },
      button2Link: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_hero", underscored: true }
  );
  return EsgHero;
};

