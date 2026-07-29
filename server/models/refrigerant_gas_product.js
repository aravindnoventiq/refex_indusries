"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasProduct = sequelize.define(
    "RefrigerantGasProduct",
    {
      image: { type: DataTypes.TEXT, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_product", underscored: true }
  );
  return RefrigerantGasProduct;
};

