"use strict";

module.exports = (sequelize, DataTypes) => {
  const AshUtilizationWhoWeAre = sequelize.define(
    "AshUtilizationWhoWeAre",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false }, // Multiple paragraphs separated by \n\n
      slides: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of { image: string }
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "ash_utilization_who_we_are", underscored: true }
  );
  return AshUtilizationWhoWeAre;
};

