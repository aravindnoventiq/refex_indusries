"use strict";

module.exports = (sequelize, DataTypes) => {
  const EsgProgramsSection = sequelize.define(
    "EsgProgramsSection",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "esg_programs_section", underscored: true }
  );
  return EsgProgramsSection;
};

