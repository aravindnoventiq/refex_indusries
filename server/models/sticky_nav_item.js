"use strict";

module.exports = (sequelize, DataTypes) => {
  const StickyNavItem = sequelize.define(
    "StickyNavItem",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      href: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sectionId: {
        type: DataTypes.STRING,
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
      tableName: "sticky_nav_items",
      underscored: true,
    }
  );

  return StickyNavItem;
};

