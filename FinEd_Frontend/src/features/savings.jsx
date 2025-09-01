// Enhanced savings.jsx
import React, { useState, useEffect } from "react";
import "./savings.css";

export default function Savings() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("savingsGoals");
    return saved
      ? JSON.parse(saved)
      : [
          { 
            id: 1,
            name: "Laptop", 
            target: 10000, 
            saved: 300, 
            deadline: "2025-12-31",
            createdDate: new Date().toISOString().split('T')[0]
          },
          { 
            id: 2,
            name: "Phone", 
            target: 500, 
            saved: 0, 
            deadline: "2025-10-15",
            createdDate: new Date().toISOString().split('T')[0]
          },
        ];
  });

  const [newGoal, setNewGoal] = useState({ name: "", target: "", deadline: "" });
  const [customAmounts, setCustomAmounts] = useState({});

  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.name.trim()) {
      alert("Please enter a goal name");
      return;
    }
    if (!newGoal.target || isNaN(newGoal.target) || parseFloat(newGoal.target) <= 0) {
      alert("Please enter a valid target amount");
      return;
    }
    if (!newGoal.deadline) {
      alert("Please select a deadline");
      return;
    }

    const goal = {
      id: Date.now(),
      name: newGoal.name.trim(),
      target: parseFloat(newGoal.target),
      saved: 0,
      deadline: newGoal.deadline,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: "", target: "", deadline: "" });
  };

  const deleteGoal = (id) => {
    if (window.confirm("Are you sure you want to delete this savings goal?")) {
      setGoals(goals.filter(goal => goal.id !== id));
      // Clean up custom amounts
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[id];
      setCustomAmounts(newCustomAmounts);
    }
  };

  const addAmount = (id, amount = null) => {
    const customAmount = amount || parseFloat(customAmounts[id]) || 100;
    if (isNaN(customAmount) || customAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, saved: Math.min(goal.target, goal.saved + customAmount) }
        : goal
    ));

    // Clear custom amount after adding
    if (!amount) {
      setCustomAmounts({ ...customAmounts, [id]: "" });
    }
  };

  const subtractAmount = (id, amount = null) => {
    const customAmount = amount || parseFloat(customAmounts[id]) || 100;
    if (isNaN(customAmount) || customAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, saved: Math.max(0, goal.saved - customAmount) }
        : goal
    ));

    // Clear custom amount after subtracting
    if (!amount) {
      setCustomAmounts({ ...customAmounts, [id]: "" });
    }
  };

  const handleKeyPress = (e, goalId) => {
    if (e.key === 'Enter') {
      addAmount(goalId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNewGoalKeyPress = (e) => {
    if (e.key === 'Enter') {
      addGoal();
    }
  };

  return (
    <div className="savings-container">
      <h2>Your Savings Goals</h2>

      <div className="add-goal-form">
        <input
          type="text"
          placeholder="Goal Name (e.g., Emergency Fund)"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          onKeyPress={handleNewGoalKeyPress}
        />
        <input
          type="number"
          placeholder="Target Amount ($)"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          onKeyPress={handleNewGoalKeyPress}
          min="0"
          step="0.01"
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
        <button onClick={addGoal}>🎯 Add Goal</button>
      </div>

      <div className="goals-list">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = ((goal.saved / goal.target) * 100);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;
            const isNearDeadline = daysRemaining <= 7 && daysRemaining >= 0;

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3>{goal.name}</h3>
                  <button
                    className="delete-btn"
                    onClick={() => deleteGoal(goal.id)}
                    title="Delete Goal"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="goal-deadline">
                  <strong>Target Date:</strong> {formatDate(goal.deadline)}
                  {isOverdue && (
                    <span style={{ color: '#ef4444', marginLeft: '10px' }}>
                      (Overdue by {Math.abs(daysRemaining)} days)
                    </span>
                  )}
                  {isNearDeadline && !isOverdue && (
                    <span style={{ color: '#f59e0b', marginLeft: '10px' }}>
                      ({daysRemaining} days left)
                    </span>
                  )}
                  {!isOverdue && !isNearDeadline && daysRemaining > 0 && (
                    <span style={{ color: '#10b981', marginLeft: '10px' }}>
                      ({daysRemaining} days left)
                    </span>
                  )}
                </div>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        background: progress >= 100 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #fbbf24 100%)'
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>${goal.saved.toFixed(2)} of ${goal.target.toFixed(2)}</span>
                    <span className="progress-percentage">
                      {progress.toFixed(1)}%
                      {progress >= 100 && " 🎉"}
                    </span>
                  </div>
                </div>

                <div className="amount-input-container">
                  <input
                    type="number"
                    placeholder="Custom amount"
                    className="amount-input"
                    value={customAmounts[goal.id] || ""}
                    onChange={(e) => setCustomAmounts({ 
                      ...customAmounts, 
                      [goal.id]: e.target.value 
                    })}
                    onKeyPress={(e) => handleKeyPress(e, goal.id)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="goal-actions">
                  <button onClick={() => addAmount(goal.id, 100)}>
                    + $100
                  </button>
                  <button onClick={() => addAmount(goal.id)}>
                    + Custom
                  </button>
                  <button onClick={() => subtractAmount(goal.id, 100)}>
                    - $100
                  </button>
                  <button onClick={() => subtractAmount(goal.id)}>
                    - Custom
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-goals-message">
            <h3>No savings goals yet</h3>
            <p>Create your first savings goal to start tracking your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}