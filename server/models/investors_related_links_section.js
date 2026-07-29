"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsRelatedLinksSection = sequelize.define(
    "InvestorsRelatedLinksSection",
    {
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "Related Links" },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_related_links_section", underscored: true }
  );
  return InvestorsRelatedLinksSection;
};

