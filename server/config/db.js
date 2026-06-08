const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// On Render free tier, write to the global temporary directory /tmp
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/database.sqlite'
  : path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`🚀 SQLite Database operating at: ${dbPath}`);
  } catch (error) {
    console.error('❌ Database boot error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };