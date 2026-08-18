"use strict";

module.exports = (sequelize, DataTypes) => {
  const LegalPage = sequelize.define(
    "LegalPage",
    {
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      heroTitle: { type: DataTypes.STRING, allowNull: true },
      contentHtml: { type: DataTypes.TEXT("long"), allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "legal_pages", underscored: true },
  );
  return LegalPage;
};
