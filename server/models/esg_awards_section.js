"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgAwardsSection = sequelize.define(
    "EsgAwardsSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_awards_section", underscored: true }
  );
  return EsgAwardsSection;
};

