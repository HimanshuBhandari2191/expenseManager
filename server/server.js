const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mounted API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

const PORT = process.env.PORT || 5000;
// Serve static assets if in production environment
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the 'public' directory we moved our React build to
  app.use(express.static(path.join(__dirname, 'public')));

  // Any non-API route loads the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });

// Sync DB Models and Boot Server
const startServer = async () => {
  try {
    // force: false ensures tables are only created if they don't exist yet
    await sequelize.sync({ force: false });
    await connectDB();
    
    
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the backend engine:', error.message);
  }
};

startServer();