// Enhanced tracker.jsx
import React, { useState } from "react";
import Expense from "./expense.jsx";
import Savings from "./savings.jsx";
import "./tracker.css";

export function Tracker() {
  const [activeTab, setActiveTab] = useState("expense");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <h1>FinEd Tracker</h1>
        <div className="tab-buttons">
          <button
            className={activeTab === "expense" ? "active" : ""}
            onClick={() => handleTabChange("expense")}
            aria-pressed={activeTab === "expense"}
          >
            💰 Expense Tracker
          </button>
          <button
            className={activeTab === "savings" ? "active" : ""}
            onClick={() => handleTabChange("savings")}
            aria-pressed={activeTab === "savings"}
          >
            🎯 Saving Goals
          </button>
        </div>
      </header>

      <main className="tracker-main">
        {activeTab === "expense" ? <Expense /> : <Savings />}
      </main>
    </div>
  );
}