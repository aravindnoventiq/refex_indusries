"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsKeyPersonnel = sequelize.define(
    "InvestorsKeyPersonnel",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      position: { type: DataTypes.STRING, allowNull: true },
      company: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      address2: { type: DataTypes.TEXT, allowNull: true },
      address3: { type: DataTypes.TEXT, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_key_personnel", underscored: true }
  );
  return InvestorsKeyPersonnel;
};

