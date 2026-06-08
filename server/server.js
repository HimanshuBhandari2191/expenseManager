const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// Serve Frontend Assets in Production Mode
if (process.env.NODE_ENV === 'production') {
  // Direct Express to look for built client files in public/
  app.use(express.static(path.join(__dirname, 'public')));

  // Fallback wildcard routing ensures client router works flawlessly
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Database Synchronization and Engine Start
const startServer = async () => {
  try {
    // Synchronize models with the database
    await sequelize.sync({ force: false });
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server operating in production mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to launch backend engine:', error.message);
  }
};

startServer();