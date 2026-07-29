"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasWhoWeAre = sequelize.define(
    "RefrigerantGasWhoWeAre",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      mainImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_who_we_are", underscored: true }
  );
  return RefrigerantGasWhoWeAre;
};

