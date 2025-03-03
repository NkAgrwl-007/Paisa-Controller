import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/budget.css";
import { ProgressBar } from "react-bootstrap";

const Budget = () => {
  const [budget, setBudget] = useState({ category: "", amount: "" });
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/budget");
      setBudgets(res.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/budget", budget);
      setBudget({ category: "", amount: "" });
      fetchBudgets();
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/budget/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const getCategorySpending = (category) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <div className="budget">
      <h1>Budget Management</h1>
      <p>Set your budget and track expenses.</p>

      {/* Budget Form */}
      <form className="budget-form" onSubmit={handleSubmit}>
        <input type="text" name="category" placeholder="Category" value={budget.category} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" value={budget.amount} onChange={handleChange} required />
        <button type="submit">Set Budget</button>
      </form>

      {/* Budget List with Tracking */}
      <div className="budget-list">
        {budgets.length === 0 ? (
          <p>No budgets set.</p>
        ) : (
          budgets.map((b) => {
            const spent = getCategorySpending(b.category);
            const remaining = b.amount - spent;
            const percentageSpent = (spent / b.amount) * 100;
            return (
              <div key={b._id} className="budget-card">
                <h3>{b.category}</h3>
                <p>Budget: ${b.amount}</p>
                <p>Spent: ${spent}</p>
                <p>Remaining: ${remaining}</p>
                <ProgressBar now={percentageSpent} label={`${percentageSpent.toFixed(1)}%`} />
                <button className="delete-btn" onClick={() => handleDelete(b._id)}>Remove</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budget;
