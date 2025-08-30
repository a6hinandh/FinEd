import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bot, TrendingDown, Newspaper, Users, Target, PiggyBank, BarChart3, Shield, Award, BookOpen, Zap, ArrowRight, Check, Star, PlayCircle, Calculator, Gamepad2, Heart } from 'lucide-react';
import './FeaturePage.css';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

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
        'Learns your preferences and adapts advice'
      ],
      color: 'ai-mentor',
      demo: 'Chat with AI about budgeting basics'
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
      demo: 'Simulate $5,000 credit card debt scenarios'
    },
    {
      id: 'finance-news',
      icon: <Newspaper className="icon-size-large" />,
      title: 'Real-time Finance News',
      subtitle: 'Stay Informed & Alert',
      description: 'Get curated financial news and personalized alerts to build awareness of market trends and opportunities.',
      benefits: [
        'Personalized news feed based on interests',
        'Real-time alerts for important changes',
        'Simplified explanations of complex topics',
        'Track trends that affect your finances'
      ],
      color: 'finance-news',
      demo: 'See how interest rate changes affect you'
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
      demo: 'Join discussion: "First apartment budgeting"'
    },
    {
      id: 'budgeting-challenges',
      icon: <Target className="icon-size-large" />,
      title: 'Budgeting Challenges',
      subtitle: 'Fun Tasks, Real Results',
      description: 'Complete engaging short-term challenges that build better spending habits through rewards and gamification.',
      benefits: [
        'Weekly and monthly spending challenges',
        'Earn points and unlock achievements',
        'Track progress with visual dashboards',
        'Build lasting financial habits'
      ],
      color: 'budgeting-challenges',
      demo: 'Challenge: Save $50 on dining out this week'
    },
    {
      id: 'savings-goals',
      icon: <PiggyBank className="icon-size-large" />,
      title: 'Savings Goals Tracker',
      subtitle: 'Visualize Your Dreams',
      description: 'Set meaningful savings targets and track progress with motivating visualizations and milestone celebrations.',
      benefits: [
        'Set multiple savings goals simultaneously',
        'Visual progress tracking',
        'Automatic savings recommendations',
        'Celebrate milestones with rewards'
      ],
      color: 'savings-goals',
      demo: 'Goal: Save $2,000 for vacation in 8 months'
    },
    {
      id: 'investment-simulator',
      icon: <BarChart3 className="icon-size-large" />,
      title: 'Investment Simulator',
      subtitle: 'Learn Investing Risk-Free',
      description: 'Experiment with virtual investments to understand risk, returns, and the power of compound growth over time.',
      benefits: [
        'Practice with virtual $10,000 portfolio',
        'Learn about stocks, bonds, and ETFs',
        'Understand risk vs. return relationships',
        'See compound growth in action'
      ],
      color: 'investment-simulator',
      demo: 'Invest $1,000 in tech stocks simulation'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners', icon: <Users className="icon-size-medium" /> },
    { number: '95%', label: 'Success Rate', icon: <Award className="icon-size-medium" /> },
    { number: '50+', label: 'Interactive Lessons', icon: <BookOpen className="icon-size-medium" /> },
    { number: '24/7', label: 'AI Support', icon: <Bot className="icon-size-medium" /> }
  ];

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
            <button className="header-button">
              Get Started
            </button>
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
          
          <h1 className="hero-title">
            Master Money<br />
            <span className="hero-title-gradient">
              Through Play
            </span>
          </h1>
          
          <p className="hero-description">
            Explore how FinEd transforms financial education through gamification, 
            AI mentorship, and community-driven learning. Every feature is designed 
            to make money management simple, engaging, and practical.
          </p>

          {/* Stats */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
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
            <p className="features-description">
              Dive deep into each feature and discover how FinEd makes financial literacy 
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

                    <button className="feature-demo-button">
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
              <button className="cta-primary-button">
                Start Learning Free
              </button>
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
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Community</a>
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
                <p className="post-text">Just saved my first $1,000! 🎉</p>
                <div className="post-stats">
                  <span>❤️ 24</span>
                  <span>💬 8 replies</span>
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
                  <span>❤️ 12</span>
                  <span>💬 15 replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'budgeting-challenges':
      return (
        <div className="mockup-challenge">
          <div className="challenge-card">
            <div className="challenge-header">
              <h4 className="challenge-title">Weekly Challenge</h4>
              <span className="challenge-status">ACTIVE</span>
            </div>
            <p className="challenge-description">Save $50 on dining out this week</p>
            <div className="challenge-progress">
              <div className="progress-info">
                <span>Progress:</span>
                <span className="progress-value">$32 / $50</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '64%' }}></div>
              </div>
              <p className="progress-meta">2 days left • +150 points reward</p>
            </div>
          </div>
        </div>
      );
    
    case 'savings-goals':
      return (
        <div className="mockup-savings">
          <div className="savings-goal vacation">
            <div className="goal-header">
              <h4 className="goal-title vacation">Vacation Fund</h4>
              <span className="goal-completion vacation">75% Complete</span>
            </div>
            <div className="goal-progress">
              <div className="goal-amounts">
                <span>Saved:</span>
                <span className="goal-saved vacation">$1,500 / $2,000</span>
              </div>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill vacation" style={{ width: '75%' }}></div>
              </div>
              <p className="goal-meta">Target: June 2025 • $125/month needed</p>
            </div>
          </div>
          <div className="savings-goal emergency">
            <div className="goal-header">
              <h4 className="goal-title emergency">Emergency Fund</h4>
              <span className="goal-completion emergency">25% Complete</span>
            </div>
            <div className="goal-progress-bar">
              <div className="goal-progress-fill emergency" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      );
    
    case 'investment-simulator':
      return (
        <div className="mockup-investment">
          <div className="portfolio-card">
            <h4 className="portfolio-title">Portfolio Performance</h4>
            <div className="portfolio-stats">
              <div className="portfolio-stat">
                <span className="portfolio-stat-label">Starting Value:</span>
                <span className="portfolio-stat-value">$10,000</span>
              </div>
              <div className="portfolio-stat">
                <span className="portfolio-stat-label">Current Value:</span>
                <span className="portfolio-stat-value portfolio-current">$12,450</span>
              </div>
              <div className="portfolio-stat">
                <span className="portfolio-stat-label">Total Return:</span>
                <span className="portfolio-stat-value portfolio-return">+24.5%</span>
              </div>
            </div>
          </div>
          <div className="holdings-grid">
            <div className="holding-item">
              <span className="holding-label">TECH</span>
              <div className="holding-return">+15.2%</div>
            </div>
            <div className="holding-item">
              <span className="holding-label">BONDS</span>
              <div className="holding-return">+3.1%</div>
            </div>
          </div>
        </div>
      );
    
    default:
      return <div className="default-mockup">Feature visualization</div>;
  }
};

export default FeaturesPage;