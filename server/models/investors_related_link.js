"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsRelatedLink = sequelize.define(
    "InvestorsRelatedLink",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      href: { type: DataTypes.TEXT, allowNull: false },
      displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_related_links", underscored: true }
  );
  return InvestorsRelatedLink;
};

