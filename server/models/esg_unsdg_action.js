"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgUnsdgAction = sequelize.define(
    "EsgUnsdgAction",
    {
      icon: { type: DataTypes.TEXT, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      points: { type: DataTypes.JSON, allowNull: false },
      video: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_unsdg_action", underscored: true }
  );
  return EsgUnsdgAction;
};

