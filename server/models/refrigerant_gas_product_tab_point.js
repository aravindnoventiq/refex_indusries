"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasProductTabPoint = sequelize.define(
    "RefrigerantGasProductTabPoint",
    {
      tabId: { type: DataTypes.STRING, allowNull: false }, // 'quality', 'safety', 'applications'
      title: { type: DataTypes.STRING, allowNull: true }, // Can be null for applications tab
      description: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_product_tab_point", underscored: true }
  );
  return RefrigerantGasProductTabPoint;
};

