"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasClient = sequelize.define(
    "RefrigerantGasClient",
    {
      image: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_client", underscored: true }
  );
  return RefrigerantGasClient;
};

