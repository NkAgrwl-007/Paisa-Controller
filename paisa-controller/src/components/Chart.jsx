import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./chart.css";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107"]; // Balance, Budget, Savings

const Chart = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/finance/${userId}`);
        const finance = await res.json();

        setData([
          { name: "Balance", value: finance.currentBalance },
          { name: "Budget", value: finance.monthlyBudget },
          { name: "Savings Goal", value: finance.savingsGoal },
        ]);
      } catch (err) {
        console.error("Error fetching finance data:", err);
      }
    };

    fetchFinanceData();
  }, [userId]);

  return (
    <div className="chart-container">
      <h2 className="chart-title">Financial Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
