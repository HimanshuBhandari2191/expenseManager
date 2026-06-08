const Budget = require('../models/Budget');

// @desc    Get budgets for all categories
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Set or Update budget for a category (Upsert operation)
exports.setBudget = async (req, res) => {
  const { category, limitAmount } = req.body;
  try {
    const [budget, created] = await Budget.upsert({
      category,
      limitAmount,
    });
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};