"use strict";

module.exports = (sequelize, DataTypes) => {
  const ReadyMixPage = sequelize.define(
    "ReadyMixPage",
    {
      contentJson: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "ready_mix_page",
      underscored: true,
    },
  );

  return ReadyMixPage;
};
