"use strict";

module.exports = (sequelize, DataTypes) => {
  const NewsItem = sequelize.define(
    "NewsItem",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.TEXT, allowNull: false },
      link: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: true }, // e.g., "Press Release", "Event", "News"
      publishedDate: { type: DataTypes.DATE, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "news_items", underscored: true }
  );

  return NewsItem;
};

