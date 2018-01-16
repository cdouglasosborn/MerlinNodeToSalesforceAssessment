'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Company = sequelize.define('company', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    employees: DataTypes.STRING,
    joinCode: DataTypes.STRING,
    plan: {
      type: DataTypes.STRING,
      defaultValue: 'SMB'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    companyLogo: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {
    associate: function(models) {
      Company.hasMany(models.companyplan);
    }
  });
  return Company;
};