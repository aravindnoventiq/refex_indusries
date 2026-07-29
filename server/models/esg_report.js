"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgReport = sequelize.define(
    "EsgReport",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_report", underscored: true }
  );
  return EsgReport;
};

