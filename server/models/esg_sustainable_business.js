"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgSustainableBusiness = sequelize.define(
    "EsgSustainableBusiness",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_sustainable_business", underscored: true }
  );
  return EsgSustainableBusiness;
};

