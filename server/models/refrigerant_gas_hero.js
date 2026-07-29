"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefrigerantGasHero = sequelize.define(
    "RefrigerantGasHero",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      slides: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // Array of { image: string }
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "refrigerant_gas_hero", underscored: true }
  );
  return RefrigerantGasHero;
};

