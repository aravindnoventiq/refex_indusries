"use strict";

module.exports = (sequelize, DataTypes) => {
  const VenwindRefexTechnicalSpec = sequelize.define(
    "VenwindRefexTechnicalSpec",
    {
      value: { type: DataTypes.STRING, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "venwind_refex_technical_spec", underscored: true }
  );
  return VenwindRefexTechnicalSpec;
};

