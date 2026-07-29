"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgGovernanceItem = sequelize.define(
    "EsgGovernanceItem",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      link: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_governance_item", underscored: true }
  );
  return EsgGovernanceItem;
};

