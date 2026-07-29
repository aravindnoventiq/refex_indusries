"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgRefexOnEsg = sequelize.define(
    "EsgRefexOnEsg",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_refex_on_esg", underscored: true }
  );
  return EsgRefexOnEsg;
};

