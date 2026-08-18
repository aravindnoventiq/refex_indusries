"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProductPage = sequelize.define(
    "ProductPage",
    {
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      bulletsJson: { type: DataTypes.TEXT, allowNull: true },
      imagesJson: { type: DataTypes.TEXT, allowNull: true },
      packagingJson: { type: DataTypes.TEXT, allowNull: true },
      propertiesJson: { type: DataTypes.TEXT, allowNull: true },
      propertiesNote: { type: DataTypes.TEXT, allowNull: true },
      msdsUrl: { type: DataTypes.TEXT, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      relatedJson: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "product_pages", underscored: true },
  );
  return ProductPage;
};
