"use strict";

module.exports = (sequelize, DataTypes) => {
  const VenwindRefexWhoWeAre = sequelize.define(
    "VenwindRefexWhoWeAre",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      mainImage: { type: DataTypes.TEXT, allowNull: true },
      smallImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "venwind_refex_who_we_are", underscored: true }
  );
  return VenwindRefexWhoWeAre;
};

