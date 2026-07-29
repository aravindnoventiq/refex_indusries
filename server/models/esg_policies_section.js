"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgPoliciesSection = sequelize.define(
    "EsgPoliciesSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_policies_section", underscored: true }
  );
  return EsgPoliciesSection;
};

