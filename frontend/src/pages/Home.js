import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    // ✅ Get user
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => navigate('/login'), 1000);
    };

    // ✅ Calculate totals
    useEffect(() => {
        const amounts = expenses.map(item => item.amount);

        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => acc + item, 0);

        const exp = amounts
            .filter(item => item < 0)
            .reduce((acc, item) => acc + item, 0) * -1;

        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    // ✅ Fetch expenses (FIXED with useCallback)
    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const result = await response.json();
            setExpenses(result?.data || []); // 🔥 SAFE FIX
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    // ✅ Proper dependency fix
    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // ✅ Delete expense
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/expenses/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result?.data || []); // 🔥 SAFE
        } catch (err) {
            handleError(err);
        }
    };

    // ✅ Add transaction
    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result?.data || []); // 🔥 SAFE
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div>
            <div className="user-section">
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />

            <ExpenseForm addTransaction={addTransaction} />

            <ExpenseTable
                expenses={expenses}
                deleteExpens={deleteExpense}
            />

            <ToastContainer />
        </div>
    );
}

export default Home;