"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgDevelopmentalOrgsSection = sequelize.define(
    "EsgDevelopmentalOrgsSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_developmental_orgs_section", underscored: true }
  );
  return EsgDevelopmentalOrgsSection;
};

