const express = require('express');
const router = express.Router();
const { getBudgets, setBudget } = require('../controllers/budgetController');

router.route('/').get(getBudgets).post(setBudget);

module.exports = router;