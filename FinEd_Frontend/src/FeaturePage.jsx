import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Bot, TrendingDown, Newspaper, Users, Target, PiggyBank, BarChart3, Shield, Award, BookOpen, Zap, ArrowRight, Check, Star, PlayCircle, Calculator, Gamepad2, Heart, Wallet, TrendingUp } from 'lucide-react';
import './FeaturePage.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (ref) => {
    sectionRefs.current[id] = ref;
  };

  const handleDemoClick = (featureId) => {
  
    const user=auth.currentUser;
   
    if(!user){
      navigate('/signup');
      return;
    }
    switch (featureId) {
      case 'ai-mentor':
        navigate('/chatbot');
        break;
      case 'credit-simulator':
        navigate('/creditOrLoan');
        break;
      case 'finance-news':
        navigate('/news');
        break;
      case 'community':
        navigate('/community');
        break;
      case 'stock':
        navigate('/stock');
        break;
      case 'expense-tracker':
        navigate('/tracker');
        break;
      default:
        // For features without existing routes, do nothing for now
        break;
    }
  };

  const features = [
    {
      id: 'ai-mentor',
      icon: <Bot className="icon-size-large" />,
      title: 'AI Money Mentor',
      subtitle: 'Your Personal Finance Guide',
      description: 'Meet your intelligent financial companion that explains complex concepts in simple terms and provides personalized advice.',
      benefits: [
        'Plain-language explanations for any financial topic',
        'Personalized money tips based on your goals',
        'Available 24/7 to answer your questions',
      ],
      color: 'ai-mentor',
      demo: 'Chat with AI about budgeting basics',
      hasRoute: true
    },
    {
      id: 'credit-simulator',
      icon: <TrendingDown className="icon-size-large" />,
      title: 'Credit & Debt Simulator',
      subtitle: 'Learn Without Real Consequences',
      description: 'Experiment with borrowing, repayments, and interest in a safe sandbox environment to understand long-term financial impact.',
      benefits: [
        'Visualize how debt compounds over time',
        'Test different repayment strategies',
        'Understand credit score factors',
        'Practice without real financial risk'
      ],
      color: 'credit-simulator',
      demo: 'Simulate $5,000 credit card debt scenarios',
      hasRoute: true
    },
    {
      id: 'finance-news',
      icon: <Newspaper className="icon-size-large" />,
      title: 'Real-time Finance News',
      subtitle: 'Stay Informed & Alert',
      description: 'Get curated financial news and personalized alerts to build awareness of market trends and opportunities.',
      benefits: [
        'Personalized news feed based on interests',
        'Simplified explanations of complex topics',
        'Track trends that affect your finances'
      ],
      color: 'finance-news',
      demo: 'See how interest rate changes affect you',
      hasRoute: true
    },
    {
      id: 'community',
      icon: <Users className="icon-size-large" />,
      title: 'Community Page',
      subtitle: 'Learn Together, Grow Together',
      description: 'Connect with peers to share experiences, challenges, and financial tips in a supportive social environment.',
      benefits: [
        'Share successes and learn from setbacks',
        'Get advice from experienced community members',
        'Participate in group challenges',
        'Build accountability partnerships'
      ],
      color: 'community',
      demo: 'Join discussion: "First apartment budgeting"',
      hasRoute: true
    },
    {
      id: 'expense-tracker',
      icon: <Wallet className="icon-size-large" />,
      title: 'Smart Expense & Savings Tracker',
      subtitle: 'Track Spending, Achieve Goals',
      description: 'Monitor your daily expenses and track savings goals in one unified dashboard with intelligent insights and spending patterns.',
      benefits: [
        'Categorize and track all your expenses',
        'Set and monitor multiple savings goals',
        'Get spending insights and budget alerts',
        'Visual progress tracking with milestones'
      ],
      color: 'expense-tracker',
      demo: 'Track expenses & save for vacation goal',
      hasRoute: true
    },
    {
      id: 'stock',
      icon: <BarChart3 className="icon-size-large" />,
      title: 'Investment Simulator',
      subtitle: 'Learn Investing Risk-Free',
      description: 'Experiment with virtual investments using real market data to understand risk, returns, and portfolio management strategies.',
      benefits: [
        'Practice with virtual ₹1,00,000 portfolio',
        'Trade Indian stocks with real-time data',
        'Learn about diversification and risk management',
        'Track performance with detailed analytics'
      ],
      color: 'investment-simulator',
      demo: 'Invest in top Indian stocks simulation',
      hasRoute: true
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners', icon: <Users className="icon-size-medium" /> },
    { number: '95%', label: 'Success Rate', icon: <Award className="icon-size-medium" /> },
    { number: '50+', label: 'Interactive Lessons', icon: <BookOpen className="icon-size-medium" /> },
    { number: '24/7', label: 'AI Support', icon: <Bot className="icon-size-medium" /> }
  ];

  
  const user=auth.currentUser;
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
   const handleLogout = () => {
    console.log("hello")
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate('/')
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="features-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-fin">Fin</span>
              <span>Ed</span>
            </div>
            {!user ? (<button onClick={()=>navigate("/signup")} className="header-button">
              Get Started
            </button>):(
              <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="header-button"
        
      >
        Hello, {user.displayName ? user.displayName : "Profile"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
  style={{
    position: "absolute",
    right: 0,
    marginTop: "8px",
    width: "160px",
    backgroundColor: "#000", // Black background
    border: "1px solid #d4af37", // Gold border
    borderRadius: "6px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.6)",
    zIndex: 10,
    overflow: "hidden",
  }}
>
  <button
    onClick={handleLogout}
    style={{
      width: "100%",
      padding: "12px",
      textAlign: "left",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      color: "#d4af37", // Gold text
      fontWeight: "500",
      transition: "all 0.2s ease-in-out",
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "#d4af37"; // Gold background on hover
      e.target.style.color = "#000"; // Black text on hover
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "none";
      e.target.style.color = "#d4af37";
    }}
  >
    Logout
  </button>
</div>

      )}
    </div>
            )}
            
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Zap className="hero-badge-icon" />
            <span className="hero-badge-text">Discover Our Features</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-containerm">
          <div className="features">
            <h2 className="features-title">
              Every Feature Designed for 
              <span className="features-title-gradient"> Your Success</span>
            </h2>
            <p className="hero-description">
            Explore how FinEd transforms financial education through gamification, 
            AI mentorship, and community-driven learning. Every feature is designed 
            to make money management simple, engaging, and practical.Dive deep into each feature and discover how FinEd makes financial literacy 
              accessible, interactive, and habit-forming.
          </p>
          </div>

          <div className="features-list-m">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                id={feature.id}
                ref={setRef(feature.id)}
                className={`feature-item ${isVisible[feature.id] ? 'visible' : ''}`}
              >
                <div className={`feature-grid ${index % 2 === 1 ? 'reverse' : ''}`}>
                  {/* Content */}
                  <div className="feature-content">
                    <div className="feature-header">
                      <div className={`feature-icon ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-subtitle">{feature.subtitle}</p>
                      </div>
                    </div>

                    <p className="feature-description">
                      {feature.description}
                    </p>

                    <div className="feature-benefits">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="benefit-item">
                          <div className="benefit-check">
                            <Check className="benefit-check-icon" />
                          </div>
                          <span className="benefit-text">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      className="feature-demo-button"
                      onClick={() => handleDemoClick(feature.id)}
                      disabled={!feature.hasRoute}
                      style={{ 
                        opacity: feature.hasRoute ? 1 : 0.6,
                        cursor: feature.hasRoute ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <PlayCircle className="icon-size-medium" />
                      <span>{feature.demo}</span>
                      <ArrowRight className="demo-button-arrow" />
                    </button>
                  </div>

                  {/* Visual Mock-up */}
                  <div className="feature-visual">
                    <div className={`visual-background ${feature.color}`}></div>
                    <div className="visual-content">
                      <FeatureMockup feature={feature} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FinEd */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2 className="why-choose-title">
            Why <span className="features-title-gradient">FinEd</span> Works
          </h2>
          
          <div className="why-choose-grid">
            <div className="why-choose-card">
              <Gamepad2 className="why-choose-icon gamified" />
              <h3 className="why-choose-card-title">Gamified Learning</h3>
              <p className="why-choose-card-description">
                Turn financial education into an engaging game with rewards, challenges, and achievements that motivate continuous learning.
              </p>
            </div>
            
            <div className="why-choose-card">
              <Shield className="why-choose-icon risk-free" />
              <h3 className="why-choose-card-title">Risk-Free Practice</h3>
              <p className="why-choose-card-description">
                Learn from mistakes without real financial consequences through simulations and virtual environments.
              </p>
            </div>
            
            <div className="why-choose-card">
              <Heart className="why-choose-icon community" />
              <h3 className="why-choose-card-title">Community Support</h3>
              <p className="why-choose-card-description">
                Connect with peers facing similar challenges and celebrate financial wins together in a supportive environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2 className="cta-title">
              Ready to Transform Your 
              <span className="features-title-gradient"> Financial Future?</span>
            </h2>
            <p className="cta-description">
              Join thousands of young people who are already building better financial habits through FinEd's innovative platform.
            </p>
            <div className="cta-buttons">
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="logo-fin">Fin</span>
            <span>Ed</span>
          </div>
          <p className="footer-description">
            Empowering the next generation with financial wisdom through innovative education.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="/features" className="footer-link">Features</a>
            <a href="/signup" className="footer-link">Community</a>
            <a href="#" className="footer-link">Support</a>
          </div>
          <p className="footer-copyright">© 2025 FinEd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Mock-up components for each feature
const FeatureMockup = ({ feature }) => {
  switch (feature.id) {
    case 'ai-mentor':
      return (
        <div className="mockup-ai-mentor">
          <div className="chat-user">
            <p className="chat-user-text">You: "How do I start budgeting?"</p>
          </div>
          <div className="chat-ai">
            <div className="chat-ai-content">
              <Bot className="chat-ai-icon" />
              <div>
                <p className="chat-ai-text">
                  Great question! Let's start with the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings...
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'credit-simulator':
      return (
        <div className="mockup-credit-simulator">
          <div className="debt-card">
            <h4 className="debt-card-title">Credit Card Debt: $5,000</h4>
            <div className="debt-details">
              <div className="debt-detail">
                <span>Minimum Payment (3%):</span>
                <span className="debt-detail-value">$150/month</span>
              </div>
              <div className="debt-detail">
                <span>Time to Pay Off:</span>
                <span className="debt-detail-value">4.2 years</span>
              </div>
              <div className="debt-detail">
                <span>Total Interest:</span>
                <span className="debt-detail-value">$2,847</span>
              </div>
            </div>
          </div>
          <div className="strategy-card">
            <h4 className="strategy-card-title">Double Payment Strategy</h4>
            <div className="debt-details">
              <div className="debt-detail">
                <span>Payment:</span>
                <span className="strategy-detail-value">$300/month</span>
              </div>
              <div className="debt-detail">
                <span>Time to Pay Off:</span>
                <span className="strategy-detail-value">1.4 years</span>
              </div>
              <div className="debt-detail">
                <span>Total Interest:</span>
                <span className="strategy-detail-value">$847</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'finance-news':
      return (
        <div className="mockup-news">
          <div className="news-alert">
            <div className="alert-header">
              <div className="alert-indicator"></div>
              <span className="alert-label">PERSONAL ALERT</span>
            </div>
            <p className="alert-text">Fed cuts interest rates - your savings account APY may decrease</p>
          </div>
          <div className="news-item">
            <div className="news-header">
              <TrendingDown className="news-icon" />
              <span className="news-label">MARKET NEWS</span>
            </div>
            <p className="alert-text">Stock market dips - good time to learn about dollar-cost averaging</p>
          </div>
        </div>
      );
    
    case 'community':
      return (
        <div className="mockup-community">
          <div className="community-post">
            <div className="post-content">
              <div className="post-avatar avatar-purple">A</div>
              <div className="post-body">
                <p className="post-author">Alex_22</p>
                <p className="post-text">Just saved my first $1,000!</p>
                <div className="post-stats">
                  <span>24 likes</span>
                  <span>8 replies</span>
                </div>
              </div>
            </div>
          </div>
          <div className="community-post">
            <div className="post-content">
              <div className="post-avatar avatar-yellow">M</div>
              <div className="post-body">
                <p className="post-author">MoneyMaven</p>
                <p className="post-text">Tips for first apartment budgeting?</p>
                <div className="post-stats">
                  <span>12 likes</span>
                  <span>15 replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'expense-tracker':
      return (
        <div className="mockup-expense-tracker">
          <div className="expense-summary">
            <div className="expense-card">
              <h4 className="expense-card-title">This Month's Spending</h4>
              <div className="expense-amount">₹12,450</div>
              <div className="expense-breakdown">
                <div className="expense-category">
                  <span className="category-dot food"></span>
                  <span>Food: ₹4,200</span>
                </div>
                <div className="expense-category">
                  <span className="category-dot transport"></span>
                  <span>Transport: ₹2,800</span>
                </div>
                <div className="expense-category">
                  <span className="category-dot entertainment"></span>
                  <span>Entertainment: ₹3,150</span>
                </div>
              </div>
            </div>
          </div>
          <div className="savings-goals-mini">
            <div className="goal-card">
              <h4 className="goal-title">Vacation Fund</h4>
              <div className="goal-progress-mini">
                <div className="goal-bar">
                  <div className="goal-fill" style={{ width: '65%' }}></div>
                </div>
                <span className="goal-percentage">65% - ₹13,000/₹20,000</span>
              </div>
            </div>
            <div className="goal-card">
              <h4 className="goal-title">Emergency Fund</h4>
              <div className="goal-progress-mini">
                <div className="goal-bar">
                  <div className="goal-fill emergency" style={{ width: '40%' }}></div>
                </div>
                <span className="goal-percentage">40% - ₹20,000/₹50,000</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'stock':
      return (
        <div className="mockup-investment-advanced">
          <div className="stock-portfolio-header">
            <div className="portfolio-value">
              <h4>Portfolio Value</h4>
              <div className="value-display">₹1,24,500</div>
              <div className="portfolio-change positive">+₹24,500 (+24.5%)</div>
            </div>
            <div className="market-status">
              <div className="market-indicator active"></div>
              <span>Market Open</span>
            </div>
          </div>
          
          <div className="stock-holdings">
            <div className="holding-stock">
              <div className="stock-info">
                <span className="stock-symbol">RELIANCE</span>
                <span className="shares">25 shares</span>
              </div>
              <div className="stock-performance">
                <span className="current-price">₹2,450</span>
                <span className="change positive">+2.3%</span>
              </div>
            </div>
            
            <div className="holding-stock">
              <div className="stock-info">
                <span className="stock-symbol">TCS</span>
                <span className="shares">15 shares</span>
              </div>
              <div className="stock-performance">
                <span className="current-price">₹3,850</span>
                <span className="change negative">-1.2%</span>
              </div>
            </div>
            
            <div className="holding-stock">
              <div className="stock-info">
                <span className="stock-symbol">HDFCBANK</span>
                <span className="shares">10 shares</span>
              </div>
              <div className="stock-performance">
                <span className="current-price">₹1,650</span>
                <span className="change positive">+0.8%</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-chart-mini">
            <div className="chart-placeholder">
              <div className="chart-line"></div>
              <div className="chart-points">
                <div className="point" style={{ left: '10%', bottom: '20%' }}></div>
                <div className="point" style={{ left: '30%', bottom: '45%' }}></div>
                <div className="point" style={{ left: '50%', bottom: '35%' }}></div>
                <div className="point" style={{ left: '70%', bottom: '60%' }}></div>
                <div className="point active" style={{ left: '90%', bottom: '75%' }}></div>
              </div>
            </div>
            <div className="chart-label">7-Day Performance</div>
          </div>
        </div>
      );
    
    default:
      return <div className="default-mockup">Feature visualization</div>;
  }
};

export default FeaturesPage;