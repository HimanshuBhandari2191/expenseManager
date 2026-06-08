import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, Edit2, Download, AlertTriangle, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

export default function App() {
  // State
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All', 'ThisMonth', 'LastMonth'

  // Form State (Combined Add/Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' });
  const [budgetForm, setBudgetForm] = useState({ category: 'Food', limitAmount: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  // API Calls
  const fetchExpenses = async () => {
    const res = await axios.get(`${API_BASE}/expenses`);
    setExpenses(res.data);
  };

  const fetchBudgets = async () => {
    const res = await axios.get(`${API_BASE}/budgets`);
    const budgetMap = {};
    res.data.forEach(b => { budgetMap[b.category] = b.limitAmount; });
    setBudgets(budgetMap);
  };

  // Expense Handlers
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(form.amount) <= 0) return setError('Amount must be positive.');
    if (new Date(form.date) > new Date()) return setError('Date cannot be in the future.');

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/expenses/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(`${API_BASE}/expenses`, form);
      }
      setForm({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], note: '' });
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.error || 'Validation error');
    }
  };

  const handleEditClick = (expense) => {
    setIsEditing(true);
    setEditId(expense.id);
    setForm({ amount: expense.amount, category: expense.category, date: expense.date, note: expense.note || '' });
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await axios.delete(`${API_BASE}/expenses/${id}`);
      fetchExpenses();
    }
  };

  // Budget Handler
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (Number(budgetForm.limitAmount) < 0) return;
    await axios.post(`${API_BASE}/budgets`, budgetForm);
    setBudgetForm({ category: 'Food', limitAmount: '' });
    fetchBudgets();
  };

  // Filtering Logic
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    
    const expDate = new Date(exp.date);
    const now = new Date();
    const isThisMonth = expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    const isLastMonth = expDate.getMonth() === (now.getMonth() === 0 ? 11 : now.getMonth() - 1) && 
                        expDate.getFullYear() === (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());

    const matchesDate = dateFilter === 'All' || 
                        (dateFilter === 'ThisMonth' && isThisMonth) || 
                        (dateFilter === 'LastMonth' && isLastMonth);

    return matchesCategory && matchesDate;
  });

  // Aggregation Framework (Metrics)
  const currencyFormat = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);

  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((acc, c) => acc + c.amount, 0);
  const highestSingleExpense = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0;

  // Grouped Category Spending for Dashboard Chart
  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals)
    .map(cat => ({ name: cat, value: categoryTotals[cat] }))
    .filter(item => item.value > 0);

  // CSV Export Engine
  const exportCSV = () => {
    const headers = ['Date,Category,Amount,Note\n'];
    const rows = filteredExpenses.map(e => `"${e.date}","${e.category}",${e.amount},"${e.note || ''}"`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mini Expense Tracker</h1>
            <p className="text-slate-500 text-sm mt-1">Manage, aggregate, and visualize your financial layouts effortlessly.</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Summary Metric Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Spent This Month</p>
              <h3 className="text-2xl font-bold text-slate-900">{currencyFormat(totalThisMonth)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Highest Single Expense</p>
              <h3 className="text-2xl font-bold text-slate-900">{currencyFormat(highestSingleExpense)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Filtered Total Spending</p>
              <h3 className="text-2xl font-bold text-slate-900">{currencyFormat(filteredExpenses.reduce((a,c)=>a+c.amount, 0))}</h3>
            </div>
          </div>
        </div>

        {/* Input Forms and Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Expense Logging Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus size={18} /> {isEditing ? 'Modify Entry' : 'Log Expense'}
            </h2>
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2"><AlertTriangle size={16}/> {error}</div>}
            
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (INR)</label>
                <input type="number" step="0.01" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Note (Optional)</label>
                <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="e.g. Groceries dinner" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"/>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition">
                {isEditing ? 'Save Realignment' : 'Commit Expense'}
              </button>
              {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({amount:'', category:'Food', date: new Date().toISOString().split('T')[0], note:''}); }} className="w-full bg-slate-100 text-slate-700 font-medium py-2 rounded-lg text-sm transition mt-1">Cancel</button>}
            </form>
          </div>

          {/* Allocation Breakdown Charts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Category Allocations</h2>
            <div className="h-64 w-full flex items-center justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[CATEGORIES.indexOf(entry.name)]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currencyFormat(value)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">No localized metrics matching operational filters.</p>
              )}
            </div>
          </div>

          {/* Budget Setting Per Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Configure Thresholds</h2>
            <form onSubmit={handleBudgetSubmit} className="flex gap-2">
              <select value={budgetForm.category} onChange={e => setBudgetForm({...budgetForm, category: e.target.value})} className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Cap Limit" required value={budgetForm.limitAmount} onChange={e => setBudgetForm({...budgetForm, limitAmount: e.target.value})} className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"/>
              <button type="submit" className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800">Set</button>
            </form>

            <div className="space-y-3 pt-2">
              {CATEGORIES.map(cat => {
                const limit = budgets[cat] || 0;
                const spent = categoryTotals[cat] || 0;
                const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                const exceeded = limit > 0 && spent > limit;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{cat}</span>
                      <span className={`${exceeded ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                        {currencyFormat(spent)} / {limit > 0 ? currencyFormat(limit) : 'No Limit'}
                      </span>
                    </div>
                    {limit > 0 && (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${exceeded ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Data Filter Workspace and Operational Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Ledger Index</h2>
            
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Filter Category</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Time Dimension</label>
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                  <option value="All">All Time</option>
                  <option value="ThisMonth">This Month</option>
                  <option value="LastMonth">Last Month</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Note</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">{exp.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${COLORS[CATEGORIES.indexOf(exp.category)]}20`, color: COLORS[CATEGORIES.indexOf(exp.category)] }}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs text-slate-500">{exp.note || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">{currencyFormat(exp.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEditClick(exp)} className="text-slate-400 hover:text-blue-600 transition"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">No financial data entries available for this query configuration.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}