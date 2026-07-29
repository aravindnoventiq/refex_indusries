"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasImpact = sequelize.define(
    "RefrigerantGasImpact",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_impact", underscored: true }
  );
  return RefrigerantGasImpact;
};

