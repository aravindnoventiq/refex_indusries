"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityWhoWeAre = sequelize.define(
    "GreenMobilityWhoWeAre",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false }, // Multiple paragraphs separated by \n\n
      slides: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of { image: string }
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_who_we_are", underscored: true }
  );
  return GreenMobilityWhoWeAre;
};

