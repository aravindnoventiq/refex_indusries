"use strict";

module.exports = (sequelize, DataTypes) => {
  const ContactForm = sequelize.define(
    "ContactForm",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.TEXT, allowNull: true },
      mapEmbedUrl: { type: DataTypes.TEXT, allowNull: true },
      formEndpointUrl: { type: DataTypes.TEXT, allowNull: false },
      successMessage: { type: DataTypes.TEXT, allowNull: true },
      errorMessage: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "contact_form", underscored: true }
  );
  return ContactForm;
};

