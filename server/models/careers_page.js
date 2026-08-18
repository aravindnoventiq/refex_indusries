"use strict";

module.exports = (sequelize, DataTypes) => {
  const CareersPage = sequelize.define(
    "CareersPage",
    {
      heroEyebrow: { type: DataTypes.STRING, allowNull: true },
      heroTitle: { type: DataTypes.STRING, allowNull: false },
      heroSubtitle: { type: DataTypes.TEXT, allowNull: true },
      heroBackground: { type: DataTypes.TEXT, allowNull: true },
      heroCtaText: { type: DataTypes.STRING, allowNull: true },
      lifeEyebrow: { type: DataTypes.STRING, allowNull: true },
      lifeTitle: { type: DataTypes.STRING, allowNull: true },
      lifeSubtitle: { type: DataTypes.TEXT, allowNull: true },
      lifeImage: { type: DataTypes.TEXT, allowNull: true },
      whyTitle: { type: DataTypes.STRING, allowNull: true },
      whySubtitle: { type: DataTypes.TEXT, allowNull: true },
      whyBackground: { type: DataTypes.TEXT, allowNull: true },
      whyCardsJson: { type: DataTypes.TEXT, allowNull: true },
      whyValuesJson: { type: DataTypes.TEXT, allowNull: true },
      talentEyebrow: { type: DataTypes.STRING, allowNull: true },
      talentTitle: { type: DataTypes.STRING, allowNull: true },
      talentBackground: { type: DataTypes.TEXT, allowNull: true },
      formTitle: { type: DataTypes.STRING, allowNull: true },
      formSubtitle: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "careers_page", underscored: true },
  );
  return CareersPage;
};
