"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgGovernanceSection = sequelize.define(
    "EsgGovernanceSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_governance_section", underscored: true }
  );
  return EsgGovernanceSection;
};

