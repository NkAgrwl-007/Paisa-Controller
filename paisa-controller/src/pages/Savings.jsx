import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Savings = () => {
  const goal = 100000; // Example savings goal
  const saved = 65000; // Example saved amount
  const percentage = Math.round((saved / goal) * 100);

  const data = [
    { name: "Saved", value: saved },
    { name: "Remaining", value: goal - saved },
  ];

  const COLORS = ["#4ade80", "#d1d5db"];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Card */}
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Savings Progress
          </h2>
          <p className="text-gray-500 mb-2">
            {`₹${saved.toLocaleString()} saved of ₹${goal.toLocaleString()}`}
          </p>
          <Progress value={percentage} className="h-3 bg-gray-200" />
          <p className="mt-3 text-sm text-gray-600">{percentage}% Complete</p>
        </CardContent>
      </Card>

      {/* Chart Card */}
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Savings Breakdown
          </h2>
          <div className="h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
          </div>
          <div className="flex justify-around mt-4">
            <span className="text-sm text-green-600 font-medium">
              ● Saved: ₹{saved.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              ● Remaining: ₹{(goal - saved).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Savings;
