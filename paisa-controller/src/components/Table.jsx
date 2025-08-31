import React, { useEffect, useState } from "react";
import "./table.css";

const Table = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/finance/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-heading">Recent Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.description}</td>
                <td className={txn.type === "income" ? "income" : "expense"}>
                  {txn.type}
                </td>
                <td className={txn.type === "income" ? "income" : "expense"}>
                  {txn.amount}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
