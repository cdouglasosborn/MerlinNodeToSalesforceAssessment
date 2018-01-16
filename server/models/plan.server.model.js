'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {

  var Plan = sequelize.define('plan',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: DataTypes.STRING,
      normalizedName: DataTypes.STRING,
      description: DataTypes.STRING,
      propertiesTxt: {
        type: DataTypes.STRING,
        defaultValue: '[]'
      },
      propertiesObj: {
        type: DataTypes.STRING,
        defaultValue: '{}'
      },
      price: DataTypes.FLOAT,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
      },
      perUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      sortOrder: DataTypes.INTEGER,
      trialPeriodLength: DataTypes.INTEGER
    }
  );

  return Plan;
};
