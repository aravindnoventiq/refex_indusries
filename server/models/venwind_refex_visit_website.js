"use strict";

module.exports = (sequelize, DataTypes) => {
  const VenwindRefexVisitWebsite = sequelize.define(
    "VenwindRefexVisitWebsite",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      buttonText: { type: DataTypes.STRING, allowNull: true },
      buttonLink: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "venwind_refex_visit_website", underscored: true }
  );
  return VenwindRefexVisitWebsite;
};

