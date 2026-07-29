"use strict";

module.exports = (sequelize, DataTypes) => {
  const Header = sequelize.define(
    "Header",
    {
      logoUrl: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      logoAlt: { type: DataTypes.STRING, allowNull: true },
      // Stock info
      showStockInfo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      bsePrice: { type: DataTypes.STRING, allowNull: true },
      bseChange: { type: DataTypes.STRING, allowNull: true },
      bseChangeIndicator: { type: DataTypes.STRING, allowNull: true, defaultValue: "down" }, // "up" or "down"
      nsePrice: { type: DataTypes.STRING, allowNull: true },
      nseChange: { type: DataTypes.STRING, allowNull: true },
      nseChangeIndicator: { type: DataTypes.STRING, allowNull: true, defaultValue: "down" }, // "up" or "down"
      // Navigation items - stored as JSON
      navigationItems: { 
        type: DataTypes.JSON, 
        allowNull: false, 
        defaultValue: [],
        comment: "Array of navigation items with name, href, dropdown items, etc."
      },
      // Contact Us button
      contactButtonText: { type: DataTypes.STRING, allowNull: false, defaultValue: "Contact Us" },
      contactButtonHref: { type: DataTypes.STRING, allowNull: false, defaultValue: "/contact/" },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "header", underscored: true }
  );
  return Header;
};

