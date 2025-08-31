import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Use updated Navbar
import "../styles/transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
  });

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (user && token) {
      fetchTransactions();
    }
  }, [user]);

  // ✅ Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/transactions?userId=${user.id || user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add new transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/transactions`,
        {
          ...formData,
          amount: Number(formData.amount),
          userId: user.id || user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactions([...transactions, res.data]);
      setFormData({ type: "income", category: "", amount: "", date: "" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // ✅ Delete transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <>
      {/* ✅ Navbar on top */}
      <Navbar />

      <div className="transactions page-container">
        <h1 className="page-title">📒 Transactions</h1>
        <p className="page-subtitle">Manage your income and expenses with ease.</p>

        {/* ✅ Transaction Form */}
        <form className="transaction-form glass-card" onSubmit={handleSubmit}>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>

        {/* ✅ Transaction List */}
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <p className="empty-state">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx._id} className={`transaction-card glass-card ${tx.type}`}>
                <span>{new Date(tx.date).toLocaleDateString()}</span>
                <span>{tx.category}</span>
                <span className="amount">
                  {tx.type === "income" ? "+" : "-"}${tx.amount}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(tx._id)}
                >
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
