"use strict";

module.exports = (sequelize, DataTypes) => {
  const AboutPageSection = sequelize.define(
    "AboutPageSection",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "about_page_sections",
      underscored: true,
    }
  );

  return AboutPageSection;
};

