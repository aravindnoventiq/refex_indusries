"use strict";

module.exports = (sequelize, DataTypes) => {
  const ValueItem = sequelize.define(
    "ValueItem",
    {
      letter: { type: DataTypes.STRING, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: true },
      icon: { type: DataTypes.STRING, allowNull: true },
      color: { type: DataTypes.STRING, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "value_items", underscored: true }
  );
  return ValueItem;
};


