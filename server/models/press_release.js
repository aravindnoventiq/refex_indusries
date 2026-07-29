"use strict";

module.exports = (sequelize, DataTypes) => {
  const PressRelease = sequelize.define(
    "PressRelease",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false },
      source: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      link: { type: DataTypes.TEXT, allowNull: false },
      isVideo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "press_release", underscored: true }
  );
  return PressRelease;
};

