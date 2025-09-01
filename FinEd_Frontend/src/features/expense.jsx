// Enhanced expense.jsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "./expense.css";

export default function Expense() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved
      ? JSON.parse(saved)
      : [
          { 
            id: 1,
            amount: 200, 
            category: "Groceries", 
            description: "Weekly groceries",
            date: new Date().toISOString().split('T')[0]
          },
          { 
            id: 2,
            amount: 500, 
            category: "Rent", 
            description: "Monthly rent",
            date: new Date().toISOString().split('T')[0]
          },
          { 
            id: 3,
            amount: 60, 
            category: "Transport", 
            description: "Bus pass",
            date: new Date().toISOString().split('T')[0]
          },
        ];
  });

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Groceries",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const categories = ["Groceries", "Rent", "Transport", "Utilities", "Entertainment", "Healthcare", "Other"];
  const COLORS = ["#FFD700", "#FFA500", "#FF6347", "#32CD32", "#1E90FF", "#DA70D6", "#F0E68C"];

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.amount || isNaN(newExpense.amount) || parseFloat(newExpense.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (!newExpense.description.trim()) {
      alert("Please enter a description");
      return;
    }

    const expense = {
      id: Date.now(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description.trim(),
      date: newExpense.date
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ 
      amount: "", 
      category: "Groceries", 
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addExpense();
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === "amount") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }
    
    if (sortBy === "date") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const chartData = categories
    .map((cat) => ({
      name: cat,
      value: expenses
        .filter((exp) => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0),
    }))
    .filter((item) => item.value > 0);

  const barChartData = chartData.map(item => ({
    ...item,
    amount: item.value
  }));

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}: $${payload[0].value.toFixed(2)}`}</p>
          <p className="tooltip-percentage">
            {`${((payload[0].value / totalAmount) * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>💸 Expense Management</h2>
        <div className="total-summary">
          <div className="total-label">Total Expenses</div>
          <div className="total-amount">${totalAmount.toFixed(2)}</div>
          <div className="total-count">{expenses.length} transactions</div>
        </div>
      </div>

      <div className="add-expense-section">
        <h3>Add New Expense</h3>
        <div className="expense-inputs">
          <div className="input-group">
            <label>Amount ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              onKeyPress={handleKeyPress}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="input-group category">
            <label>Category</label>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <button className="add-expense-btn" onClick={addExpense}>
            ➕ Add Expense
          </button>
        </div>
      </div>

      <div className="expense-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          📋 History
        </button>
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && chartData.length > 0 && (
          <div className="expense-chart">
            <h3>Expense Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="category-summary">
              {chartData.map((item, index) => (
                <div key={item.name} className="category-item">
                  <div 
                    className="category-color" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="category-name">{item.name}</span>
                  <span className="category-amount">${item.value.toFixed(2)}</span>
                  <span className="category-percentage">
                    {((item.value / totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && chartData.length > 0 && (
          <div className="expense-analytics">
            <h3>Category Breakdown</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 215, 0, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffd700"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#ffd700" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="url(#goldGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="expense-history">
            <div className="history-header">
              <h3>💳 Expense History</h3>
              <div className="sort-controls">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="category">Sort by Category</option>
                  <option value="description">Sort by Description</option>
                </select>
                <button 
                  className="sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                >
                  {sortOrder === "asc" ? "⬆️" : "⬇️"}
                </button>
              </div>
            </div>
            
            {expenses.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{formatDate(exp.date)}</td>
                        <td className="amount-cell">${exp.amount.toFixed(2)}</td>
                        <td>
                          <span className="category-badge">{exp.category}</span>
                        </td>
                        <td>{exp.description || "-"}</td>
                        <td>
                          <button
                            className="delete-expense-btn"
                            onClick={() => deleteExpense(exp.id)}
                            title="Delete Expense"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-expenses-message">
                <h4>No expenses recorded yet</h4>
                <p>Start by adding your first expense above!</p>
              </div>
            )}
          </div>
        )}

        {(activeTab === "overview" || activeTab === "analytics") && chartData.length === 0 && (
          <div className="no-data-message">
            <h3>📊 No Data Available</h3>
            <p>Add some expenses to see your spending overview and analytics!</p>
          </div>
        )}
      </div>
    </div>
  );
}