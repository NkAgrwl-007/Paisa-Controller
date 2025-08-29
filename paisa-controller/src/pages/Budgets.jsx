import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/budget.css";
import { ProgressBar } from "react-bootstrap";

const Budget = () => {
  const [budget, setBudget] = useState({ category: "", amount: "" });
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get token from localStorage (auth support)
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchBudgets();
      fetchTransactions();
    }
  }, [token]);

  // ✅ Fetch Budgets
  const fetchBudgets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(res.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // ✅ Handle form change
  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  // ✅ Add/Update Budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget.category || !budget.amount) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/budget", budget, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget({ category: "", amount: "" });
      fetchBudgets();
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  // ✅ Delete Budget
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  // ✅ Calculate category spending
  const getCategorySpending = (category) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  if (loading) return <p>Loading budgets...</p>;

  return (
    <div className="budget">
      <h1>Budget Management</h1>
      <p>Set your budget and track expenses easily.</p>

      {/* Budget Form */}
      <form className="budget-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={budget.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={budget.amount}
          onChange={handleChange}
          required
        />
        <button type="submit">Set Budget</button>
      </form>

      {/* Budget List with Tracking */}
      <div className="budget-list">
        {budgets.length === 0 ? (
          <p>No budgets set yet.</p>
        ) : (
          budgets.map((b) => {
            const spent = getCategorySpending(b.category);
            const remaining = b.amount - spent;
            const percentageSpent = Math.min((spent / b.amount) * 100, 100);

            return (
              <div key={b._id} className="budget-card">
                <h3>{b.category}</h3>
                <p><strong>Budget:</strong> ${b.amount}</p>
                <p><strong>Spent:</strong> ${spent}</p>
                <p><strong>Remaining:</strong> ${remaining}</p>
                <ProgressBar
                  now={percentageSpent}
                  label={`${percentageSpent.toFixed(1)}%`}
                  variant={percentageSpent > 100 ? "danger" : "success"}
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(b._id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budget;
