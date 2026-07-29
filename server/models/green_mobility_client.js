"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityClient = sequelize.define(
    "GreenMobilityClient",
    {
      image: { type: DataTypes.TEXT, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_clients", underscored: true }
  );
  return GreenMobilityClient;
};

