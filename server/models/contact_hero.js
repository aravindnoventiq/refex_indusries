"use strict";

module.exports = (sequelize, DataTypes) => {
  const ContactHero = sequelize.define(
    "ContactHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "contact_hero", underscored: true }
  );
  return ContactHero;
};

