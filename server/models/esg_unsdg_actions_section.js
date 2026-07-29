"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgUnsdgActionsSection = sequelize.define(
    "EsgUnsdgActionsSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_unsdg_actions_section", underscored: true }
  );
  return EsgUnsdgActionsSection;
};

