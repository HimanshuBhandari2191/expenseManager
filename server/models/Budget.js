const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Budget = sequelize.define('Budget', {
  category: {
    type: DataTypes.ENUM('Food', 'Transport', 'Bills', 'Entertainment', 'Other'),
    primaryKey: true,
  },
  limitAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    validate: {
      min: 0,
    },
  },
});

module.exports = Budget;