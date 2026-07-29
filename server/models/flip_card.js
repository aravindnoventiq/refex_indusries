"use strict";

module.exports = (sequelize, DataTypes) => {
  const FlipCard = sequelize.define(
    "FlipCard",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      backImage: { type: DataTypes.TEXT, allowNull: true },
      link: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "flip_cards", underscored: true }
  );

  return FlipCard;
};

