"use strict";

module.exports = (sequelize, DataTypes) => {
  const AboutPresence = sequelize.define(
    "AboutPresence",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      mapImage: { type: DataTypes.TEXT, allowNull: true },
      presenceTextImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "about_presence", underscored: true }
  );
  return AboutPresence;
};

