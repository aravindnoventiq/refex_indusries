"use strict";

module.exports = (sequelize, DataTypes) => {
  const NewsroomTab = sequelize.define(
    "NewsroomTab",
    {
      key: { type: DataTypes.STRING, allowNull: false, unique: true },
      label: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "newsroom_tab", underscored: true }
  );
  return NewsroomTab;
};

