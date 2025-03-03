import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/transactions", formData);
      setTransactions([...transactions, res.data]);
      setFormData({ type: "income", category: "", amount: "", date: "" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="transactions">
      <h1>Transactions</h1>
      <p>Manage your income and expenses.</p>

      {/* Transaction Form */}
      <form className="transaction-form" onSubmit={handleSubmit}>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <button type="submit">Add Transaction</button>
      </form>

      {/* Transaction List */}
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx._id} className={`transaction-card ${tx.type}`}>
              <span>{tx.date}</span>
              <span>{tx.category}</span>
              <span className="amount">{tx.type === "income" ? "+" : "-"}${tx.amount}</span>
              <button className="delete-btn" onClick={() => handleDelete(tx._id)}>X</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
