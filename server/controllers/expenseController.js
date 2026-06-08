const Expense = require('../models/Expense');

// @desc    Get all expenses sorted by newest first
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ order: [['date', 'DESC']] });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const newExpense = await Expense.create(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const [updatedRows] = await Expense.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) return res.status(404).json({ message: 'Expense not found' });
    
    const updatedExpense = await Expense.findByPk(req.params.id);
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedRows = await Expense.destroy({ where: { id: req.params.id } });
    if (!deletedRows) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};