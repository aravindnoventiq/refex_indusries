"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgSdgSection = sequelize.define(
    "EsgSdgSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_sdg_section", underscored: true }
  );
  return EsgSdgSection;
};

