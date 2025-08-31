import React from "react";
import Card from "../components/Card"; // ✅ use your custom Card component
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Savings = () => {
  const goal = 100000;
  const saved = 65000;
  const percentage = Math.round((saved / goal) * 100);

  const data = [
    { name: "Saved", value: saved },
    { name: "Remaining", value: goal - saved },
  ];

  const COLORS = ["#4CAF50", "#E0E0E0"];

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">Savings Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Progress Card */}
        <Card
          title="Progress"
          value={`${percentage}% of goal achieved`}
          color="#4CAF50"
          icon={null}
        >
          <ResponsiveContainer width="100%" height={250}>
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Details Card */}
        <Card title="Details" color="#00c4b4" icon={null}>
          <p className="text-gray-600">Goal: ₹{goal.toLocaleString()}</p>
          <p className="text-gray-600">Saved: ₹{saved.toLocaleString()}</p>
          <p className="text-gray-600">Remaining: ₹{(goal - saved).toLocaleString()}</p>
        </Card>
      </div>
    </div>
  );
};

export default Savings;
