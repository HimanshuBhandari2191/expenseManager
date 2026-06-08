const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: { args: [0.01], msg: 'Amount must be a positive number.' },
    },
  },
  category: {
    type: DataTypes.ENUM('Food', 'Transport', 'Bills', 'Entertainment', 'Other'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY, // Stores format YYYY-MM-DD
    allowNull: false,
    validate: {
      isNotFuture(value) {
        if (new Date(value) > new Date()) {
          throw new Error('Expense date cannot be in the future.');
        }
      },
    },
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Expense;