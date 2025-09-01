import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, MessageCircle, DollarSign, TrendingUp, PieChart, Calculator, Settings, ChevronDown, Menu, ChevronLeft, ChevronRight, X, Wallet, Target, BarChart3, CreditCard, User, Home, History, LogOut } from 'lucide-react';
import './FinChatbot.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase.js";
import { fetchChatHistory } from '../FetchChatHistory.js';
import { onAuthStateChanged } from "firebase/auth";


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const FinancialChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Welcome to your Personal Financial Assistant! I'm here to help you navigate investments, budgeting, SIPs, debt management, and wealth building strategies. Let's secure your financial future together.",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [advisoryMode, setAdvisoryMode] = useState('general');
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistoryId, setChatHistoryId] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
    if (currentUser) {
      // User is signed in
      
      const data = await fetchChatHistory(currentUser.uid);
        console.log(data)
        setChatHistory(data);
      setUserName(currentUser.displayName); // save name
      createChatHistory(currentUser.uid); // pass uid here
    } else {
      // No user signed in, maybe redirect to login
      console.log("No user signed in");
    }
  });

  return () => unsubscribe();
}, []);

  const createChatHistory = async (uid) => {
  try {
    const docRef = await addDoc(collection(db, "chatHistory"), {
      userId: uid,
      createdAt: serverTimestamp(),
      messages: []
    });
    const chatDocRef = doc(db, "chatHistory", docRef.id);
    await updateDoc(chatDocRef, {
      messages: arrayUnion(
        {
      id: 1,
      type: 'bot',
      content: "Welcome to your Personal Financial Assistant! I'm here to help you navigate investments, budgeting, SIPs, debt management, and wealth building strategies. Let's secure your financial future together.",
      timestamp: new Date(),
    }
      ) // adds message to the array
    });
    setChatHistoryId(docRef.id);
    console.log("Chat history created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating chat history:", error);
  }
};





  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [advisoryMode, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      mode: advisoryMode
    };
    
    const chatDocRef = doc(db, "chatHistory", chatHistoryId);

    await updateDoc(chatDocRef, {
      messages: arrayUnion(userMessage) // adds message to the array
    });

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'financial_assistant',
          mode: advisoryMode
        }),
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response || generateMockResponse(inputMessage, advisoryMode),
        timestamp: new Date(),
        mode: advisoryMode
      };

      const chatDocRef = doc(db, "chatHistory", chatHistoryId);

    await updateDoc(chatDocRef, {
      messages: arrayUnion(botMessage) // adds message to the array
    });

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateMockResponse(inputMessage, advisoryMode),
        timestamp: new Date(),
        mode: advisoryMode
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const onSelectChat = (index) => {
    setMessages(chatHistory[index].messages);
    setShowHistoryModal(false)
  }

  const generateMockResponse = (message, mode) => {
    const responses = {
      general: [
        "Based on current market conditions, I recommend diversifying your portfolio across equity, debt, and hybrid funds for optimal risk-adjusted returns.",
        "Let me help you create a comprehensive financial plan. Start with building an emergency fund covering 6-12 months of expenses.",
        "For long-term wealth creation, consider systematic investment plans (SIPs) in well-performing mutual funds with a 15+ year horizon."
      ],
      investment: [
        "For your investment horizon, I suggest a balanced approach: 60% equity funds, 30% debt funds, and 10% alternative investments like gold ETFs.",
        "Based on your risk profile, large-cap equity funds with consistent performance over 5+ years would be suitable for your portfolio.",
        "Consider tax-saving ELSS funds to optimize your tax liability while building wealth for the long term."
      ],
      planning: [
        "Your retirement planning should follow the 4% rule. Aim to accumulate 25 times your annual expenses by retirement age.",
        "For goal-based investing, separate your investments by time horizon: short-term (debt funds), medium-term (hybrid funds), long-term (equity funds).",
        "Insurance planning is crucial. Ensure you have adequate term life insurance (10-15 times annual income) and health coverage."
      ],
      debt: [
        "Focus on high-interest debt first. Credit card debt should be your priority, followed by personal loans, then home loans.",
        "Consider debt consolidation if you have multiple high-interest loans. This can reduce your overall interest burden significantly.",
        "The debt avalanche method (paying highest interest rate debts first) is mathematically optimal for minimizing total interest paid."
      ]
    };
    
    const modeResponses = responses[mode] || responses.general;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Fresh start! I'm ready to provide ${getModeDescription(advisoryMode)} guidance. What financial goals would you like to work on today?`,
        timestamp: new Date(),
      }
    ]);
    setError(null);
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'investment':
        return 'investment advisory and portfolio management';
      case 'planning':
        return 'comprehensive financial planning';
      case 'debt':
        return 'debt management and optimization';
      default:
        return 'comprehensive financial advisory';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'investment':
        return <TrendingUp className="w-5 h-5" />;
      case 'planning':
        return <Target className="w-5 h-5" />;
      case 'debt':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const formatTime = (timestamp) => {
    timestamp = new Date(timestamp.seconds * 1000);
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = {
    general: [
      "Create a monthly budget plan",
      "Best mutual funds for 2024",
      "How to start investing with ₹5000",
      "Emergency fund calculation"
    ],
    investment: [
      "Top performing SIP funds",
      "Portfolio diversification strategy",
      "Tax-saving investment options",
      "Risk assessment for equity funds"
    ],
    planning: [
      "Retirement planning calculator",
      "Child education fund planning",
      "Home loan vs rent analysis",
      "Insurance coverage review"
    ],
    debt: [
      "Credit card debt elimination",
      "Personal loan consolidation",
      "Home loan prepayment strategy",
      "Debt-to-income ratio optimization"
    ]
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleModeChange = (mode) => {
    setAdvisoryMode(mode);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleProfileAction = (action) => {
    setShowProfile(false);
    
    switch (action) {
      case 'home':
        navigate('/features');
        break;
      case 'history':
        setShowHistoryModal(true);
        break;
      case 'logout':
        // Handle logout logic here
        console.log('Logout clicked');
        break;
    }
  };

  if (isMinimized) {
    return (
      <div className="minimized">
        <button
          className="minimized-button"
          onClick={() => setIsMinimized(false)}
        >
          <Wallet className="w-6 h-6" />
          <div className="minimized-text">
            <div className="minimized-title">Financial Assistant</div>
            <div className="minimized-subtitle">Click to expand</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="financial-chatbot-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            {!sidebarCollapsed &&<BarChart3 size={10} className="sidebar-icon" />}
            {!sidebarCollapsed && <span>Financial Tools</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-content">
            {/* Advisory Modes */}
            <div className="sidebar-section">
              <h3 className="section-title">Advisory Mode</h3>
              <div className="mode-buttons">
                {[
                  { key: 'general', label: 'General Finance', icon: <DollarSign className="mode-icon" /> },
                  { key: 'investment', label: 'Investment Advisory', icon: <TrendingUp className="mode-icon" /> },
                  { key: 'planning', label: 'Financial Planning', icon: <Target className="mode-icon" /> },
                  { key: 'debt', label: 'Debt Management', icon: <CreditCard className="mode-icon" /> }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    className={`mode-btn ${advisoryMode === mode.key ? 'active' : ''}`}
                    onClick={() => handleModeChange(mode.key)}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sidebar-section">
              <h3 className="section-title">Quick Actions</h3>
              <div className="quick-buttons">
                {quickActions[advisoryMode].map((action, index) => (
                  <button
                    key={index}
                    className="quick-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Section */}
            <div className="sidebar-section profile-section">
              <div className="profile-container">
                <button 
                  className="profile-trigger"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="profile-info">
                    <div className="profile-avatar">
                      <User className="profile-icon" />
                    </div>
                    <div className="profile-text">
                      <div className="profile-name">{userName}</div>
                    </div>
                  </div>
                  <ChevronDown className={`profile-arrow ${showProfile ? 'rotated' : ''}`} />
                </button>
                
                {showProfile && (
                  <div className="profile-dropdown">
                    <button 
                      className="profile-menu-item"
                      onClick={() => handleProfileAction('home')}
                    >
                      <Home className="menu-icon" />
                      <span>Home</span>
                    </button>
                    <button 
                      className="profile-menu-item"
                      onClick={() => handleProfileAction('history')}
                    >
                      <History className="menu-icon" />
                      <span>Chat History</span>
                    </button>
                    <button 
                      className="profile-menu-item logout"
                      onClick={() => handleProfileAction('logout')}
                    >
                      <LogOut className="menu-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="headerc">
          <div className="header-left">
            {isMobile && (
              <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="mobile-menu-icon" />
              </button>
            )}
            <div className="title-section">
              <div className="title-row">
                <Wallet className="title-icon" />
                <h1 className="title">WealthWise AI</h1>
              </div>
              <span className="subtitle">Your Personal Financial Intelligence Platform</span>
            </div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">Live Markets</span>
            </div>
          </div>
          <div className="header-actions">
            
            <button 
              className="action-btn" 
              onClick={clearChat} 
              title="New Session"
            >
              <Trash2 className="action-icon" />
            </button>
          </div>
        </div>

        

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-wrapper">
                <div className={`message ${message.type === 'user' ? 'user' : ''}`}>
                  <div className="message-content">
                    <div className={`avatar ${message.type === 'user' ? 'user' : ''}`}>
                      {message.type === 'bot' && <Wallet className="avatar-icon" />}
                      {message.type === 'user' && <div className="user-avatar">You</div>}
                    </div>
                    <div className="message-body">
                      <div className="message-text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.mode && (
                          <span className="message-mode">
                            {getModeIcon(message.mode)}
                            <span>{message.mode}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-wrapper">
                <div className="message">
                  <div className="message-content">
                    <div className="avatar">
                      <Wallet className="avatar-icon" />
                    </div>
                    <div className="typing-body">
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <span className="dot"></span>
                          <span className="dot" style={{ animationDelay: '0.2s' }}></span>
                          <span className="dot" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                        <span className="typing-text">Analyzing your financial query...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <X className="error-icon" />
            <span className="error-text">Service Issue: {error}</span>
            <button className="error-dismiss" onClick={() => setError(null)}>
              <X className="error-dismiss-icon" />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="cinput-container">
          <div className="cinput-wrapper">
            <div className="cinput-group">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${getModeDescription(advisoryMode)}...`}
                className="cmessage-input"
                rows="1"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                className={`send-btn ${(!inputMessage.trim() || isTyping) ? 'disabled' : ''}`}
                disabled={!inputMessage.trim() || isTyping}
              >
                {isTyping ? (
                  <div className="cloading-spinner"></div>
                ) : (
                  <Send className="send-icon" />
                )}
              </button>
            </div>
          </div>
          <div className="cinput-hint">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <span className="message-count">{messages.length - 1} messages</span>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <span className="footer-text">
              Powered by Advanced Financial AI
            </span>
            <div className="footer-badge">
              {getModeIcon(advisoryMode)}
              <span>{advisoryMode.charAt(0).toUpperCase() + advisoryMode.slice(1)} Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="history-modal">
            <div className="history-header">
              <h2 className="history-title">
                <History className="history-icon" />
                Chat History
              </h2>
              <button 
                className="history-close"
                onClick={() => setShowHistoryModal(false)}
              >
                <X className="close-icon" />
              </button>
            </div>
            <div className="history-content">
              <div className="history-placeholder">
                <div className="placeholder-icon">
                  <MessageCircle className="placeholder-msg-icon" />
                </div>
                {chatHistory.length!=0 ? (
                   <div className="chat-history-list">
      {chatHistory.map((chat,index) => {
        // Take first message as title or fallback
        

        return (
          <div
            key={chat.id}
            className="chat-history-item"
            onClick={() => onSelectChat(index)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              borderBottomWidth:"100%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span className="chat-title">{new Date(chat.createdAt.seconds * 1000).toLocaleString()}</span>
            
          </div>
        );
      })}
    </div>
                ):(
                  <div>
                    <h3 className="placeholder-title">No Chat History Yet</h3>
                <p className="placeholder-text">
                  Your previous conversations will appear here. This feature will be enhanced in future updates to include:
                </p>
                <ul className="feature-list">
                  <li>Search through conversation history</li>
                  <li>Export chat sessions</li>
                  <li>Bookmark important financial advice</li>
                  <li>Category-wise conversation filtering</li>
                </ul>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default FinancialChatbot;