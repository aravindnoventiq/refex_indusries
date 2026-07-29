"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsHero = sequelize.define(
    "InvestorsHero",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Investors" },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_hero", underscored: true }
  );
  return InvestorsHero;
};

