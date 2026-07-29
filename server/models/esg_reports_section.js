"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgReportsSection = sequelize.define(
    "EsgReportsSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_reports_section", underscored: true }
  );
  return EsgReportsSection;
};

