"use strict";

module.exports = (sequelize, DataTypes) => {
  const InvestorsPageContent = sequelize.define(
    "InvestorsPageContent",
    {
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      hasYearFilter: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      filterItems: { type: DataTypes.JSON, allowNull: true }, // Array of filter items (years) for the filter dropdown
      sections: { type: DataTypes.JSON, allowNull: true }, // Array of sections with documents
      showPublishDate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      showCmsPublishDate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "investors_page_content", underscored: true }
  );
  return InvestorsPageContent;
};

