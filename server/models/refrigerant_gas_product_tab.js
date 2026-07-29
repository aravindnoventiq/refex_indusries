"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasProductTab = sequelize.define(
    "RefrigerantGasProductTab",
    {
      tabId: { type: DataTypes.STRING, allowNull: false, unique: true }, // 'quality', 'safety', 'applications'
      label: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_product_tab", underscored: true }
  );
  return RefrigerantGasProductTab;
};

