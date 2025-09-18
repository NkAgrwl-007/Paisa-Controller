import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
    description: "",
    paymentMethod: "",
    recurring: false,
    tags: "",
  });

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (user && token) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/transactions?userId=${user.id || user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert("Failed to fetch transactions.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, amount, date, paymentMethod } = formData;

    if (!category || !amount || !date || !paymentMethod) {
      alert("Please fill required fields: Category, Amount, Date, Payment Method");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/transactions`,
        {
          ...formData,
          amount: Number(formData.amount),
          user: user.id || user._id,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions((prev) => [...prev, data]);
      setFormData({
        type: "income",
        category: "",
        amount: "",
        date: "",
        description: "",
        paymentMethod: "",
        recurring: false,
        tags: "",
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Failed to add transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete transaction.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="transactions page-container">
        <h1 className="page-title">📒 Transactions</h1>
        <p className="page-subtitle">Manage your income and expenses efficiently.</p>

        <form className="transaction-form glass-card" onSubmit={handleSubmit}>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Category*"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount*"
            value={formData.amount}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Payment Method*
            </option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
            />
            Recurring
          </label>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>

        <div className="transaction-list">
          {transactions.length === 0 ? (
            <p className="empty-state">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className={`transaction-card glass-card ${tx.type}`}>
                <span>{new Date(tx.date).toLocaleDateString()}</span>
                <span>{tx.category}</span>
                {tx.description && <span>{tx.description}</span>}
                <span className="amount">
                  {tx.type === "income" ? "+" : "-"}${tx.amount}
                </span>
                <span>{tx.paymentMethod}</span>
                {tx.tags && <span className="tags">{tx.tags.join(", ")}</span>}
                {tx.recurring && <span className="recurring">🔁</span>}
                <button className="delete-btn" onClick={() => handleDelete(tx._id)}>
                  ✖
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Transactions;
