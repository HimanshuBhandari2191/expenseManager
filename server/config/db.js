const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// If on Render, save database inside the persistent disk mount path (/data)
const dbPath = process.env.RENDER_DISK_PATH 
  ? path.join(process.env.RENDER_DISK_PATH, 'database.sqlite')
  : path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`🚀 SQLite Database synchronized at: ${dbPath}`);
  } catch (error) {
    console.error('❌ Database boot error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };