"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgHrSection = sequelize.define(
    "EsgHrSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_hr_section", underscored: true }
  );
  return EsgHrSection;
};

