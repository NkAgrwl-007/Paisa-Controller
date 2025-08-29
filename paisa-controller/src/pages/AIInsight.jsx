import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/AIInsight.css";

const AIInsight = () => {
  return (
    <div className="aiinsight-container">
      <Navbar />
      <div className="aiinsight-layout">
        <Sidebar />
        <main className="aiinsight-main">
          <h1 className="aiinsight-title">AI Insights</h1>
          <section className="aiinsight-section">
            <p className="aiinsight-description">
              This section provides AI-driven financial insights tailored to your
              spending habits, savings goals, and overall budget.
            </p>
          </section>
          <div className="aiinsight-cards">
            <div className="aiinsight-card">
              <h2>Spending Analysis</h2>
              <p>Your monthly expenses are 18% higher than last month.</p>
            </div>
            <div className="aiinsight-card">
              <h2>Savings Projection</h2>
              <p>If you save ₹5,000 each month, you’ll reach your goal in 12 months.</p>
            </div>
            <div className="aiinsight-card">
              <h2>Smart Suggestions</h2>
              <p>Cutting down on food delivery could save you ₹1,200 monthly.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInsight;
