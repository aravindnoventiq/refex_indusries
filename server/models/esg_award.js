"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgAward = sequelize.define(
    "EsgAward",
    {
      image: { type: DataTypes.TEXT, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_award", underscored: true }
  );
  return EsgAward;
};

