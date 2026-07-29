"use strict";

module.exports = (sequelize, DataTypes) => {
  const Footer = sequelize.define(
    "Footer",
    {
      // Footer sections - stored as JSON
      sections: { 
        type: DataTypes.JSON, 
        allowNull: false, 
        defaultValue: [],
        comment: "Array of footer sections with title and links"
      },
      // Social media links
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: "Array of social media links with platform, url, and icon"
      },
      // Contact information
      contactEmail: { type: DataTypes.STRING, allowNull: true },
      cin: { type: DataTypes.STRING, allowNull: true },
      nseScripCode: { type: DataTypes.STRING, allowNull: true },
      bseScripSymbol: { type: DataTypes.STRING, allowNull: true },
      isin: { type: DataTypes.STRING, allowNull: true },
      // Complaints section
      complaintsTitle: { type: DataTypes.STRING, allowNull: true },
      complaintsPhone: { type: DataTypes.STRING, allowNull: true },
      complaintsPhoneUrl: { type: DataTypes.TEXT, allowNull: true },
      complaintsEmail: { type: DataTypes.STRING, allowNull: true },
      // Bottom bar
      copyrightText: { type: DataTypes.TEXT, allowNull: true },
      copyrightLink: { type: DataTypes.TEXT, allowNull: true },
      copyrightLinkText: { type: DataTypes.STRING, allowNull: true },
      bottomLinks: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: "Array of bottom links (Privacy Policy, Terms of Use, etc.)"
      },
      backgroundImage: { type: DataTypes.TEXT, allowNull: true },
      backgroundImageOpacity: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.1 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "footer", underscored: true }
  );
  return Footer;
};

