"use strict";

module.exports = (sequelize, DataTypes) => {
  const GreenMobilityTestimonial = sequelize.define(
    "GreenMobilityTestimonial",
    {
      text: { type: DataTypes.TEXT, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "green_mobility_testimonials", underscored: true }
  );
  return GreenMobilityTestimonial;
};

