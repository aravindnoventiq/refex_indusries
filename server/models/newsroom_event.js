"use strict";

module.exports = (sequelize, DataTypes) => {
  const NewsroomEvent = sequelize.define(
    "NewsroomEvent",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false },
      source: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      link: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "newsroom_event", underscored: true }
  );
  return NewsroomEvent;
};

