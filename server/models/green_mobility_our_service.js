"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityOurService = sequelize.define(
    "GreenMobilityOurService",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      additionalText: { type: DataTypes.TEXT, allowNull: true },
      featuresJson: { type: DataTypes.JSON, allowNull: true }, // Array of {icon, title}
      rideTypesJson: { type: DataTypes.JSON, allowNull: true }, // Array of {icon, title}
      citiesJson: { type: DataTypes.JSON, allowNull: true }, // Array of strings
      buttonsJson: { type: DataTypes.JSON, allowNull: true }, // Array of {text, link}
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_our_services", underscored: true }
  );
  return GreenMobilityOurService;
};

