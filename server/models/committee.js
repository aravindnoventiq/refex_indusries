"use strict";

module.exports = (sequelize, DataTypes) => {
  const Committee = sequelize.define(
    "Committee",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "committees", underscored: true }
  );

  Committee.associate = function (models) {
    Committee.hasMany(models.CommitteeMember, {
      foreignKey: "committee_id",
      as: "members",
      onDelete: "CASCADE",
    });
  };

  return Committee;
};

