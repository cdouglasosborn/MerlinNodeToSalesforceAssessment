'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {

  var CompanyPlan = sequelize.define('companyplan', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    startingFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    trialPeriodLength: DataTypes.INTEGER
  }, {
    associate: function(models) {
      CompanyPlan.belongsTo(models.user, { as: 'purchasedBy' });
      CompanyPlan.belongsTo(models.plan);
      CompanyPlan.belongsTo(models.stripetransaction);
    }
  });
  return CompanyPlan;
};