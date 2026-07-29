"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityWhyChooseUs = sequelize.define(
    "GreenMobilityWhyChooseUs",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_why_choose_us", underscored: true }
  );
  return GreenMobilityWhyChooseUs;
};

