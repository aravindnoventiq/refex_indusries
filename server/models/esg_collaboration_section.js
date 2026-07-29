"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgCollaborationSection = sequelize.define(
    "EsgCollaborationSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_collaboration_section", underscored: true }
  );
  return EsgCollaborationSection;
};

