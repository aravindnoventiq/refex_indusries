"use strict";

module.exports = (sequelize, DataTypes) => {
  const CommitteeMember = sequelize.define(
    "CommitteeMember",
    {
      committeeId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        field: "committee_id",
        references: {
          model: "committees",
          key: "id",
        },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      designation: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false }, // Chairman, Member, etc.
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "committee_members", underscored: true }
  );

  CommitteeMember.associate = function (models) {
    CommitteeMember.belongsTo(models.Committee, {
      foreignKey: "committee_id",
      as: "committee",
    });
  };

  return CommitteeMember;
};

