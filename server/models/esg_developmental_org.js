"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgDevelopmentalOrg = sequelize.define(
    "EsgDevelopmentalOrg",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      logo: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_developmental_org", underscored: true }
  );
  return EsgDevelopmentalOrg;
};

