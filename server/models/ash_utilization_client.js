"use strict";

module.exports = (sequelize, DataTypes) => {
  const AshUtilizationClient = sequelize.define(
    "AshUtilizationClient",
    {
      category: { 
        type: DataTypes.ENUM('thermal', 'cement', 'concessionaires'), 
        allowNull: false 
      },
      image: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "ash_utilization_clients", underscored: true }
  );
  return AshUtilizationClient;
};

