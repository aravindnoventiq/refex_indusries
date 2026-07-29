"use strict";

module.exports = (sequelize, DataTypes) => {
  const Award = sequelize.define(
    "Award",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "awards",
      underscored: true,
    }
  );

  return Award;
};

