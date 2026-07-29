"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgMainCollaboration = sequelize.define(
    "EsgMainCollaboration",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      logo: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      largeImage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_main_collaboration", underscored: true }
  );
  return EsgMainCollaboration;
};

