"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasWhyChooseUs = sequelize.define(
    "RefrigerantGasWhyChooseUs",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      icon: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_why_choose_us", underscored: true }
  );
  return RefrigerantGasWhyChooseUs;
};

