import React, { useState,useEffect } from 'react';

const CreditCardSimulationExplanation = () => {
  const [activeSection, setActiveSection] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

     useEffect(() => {
          const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
          };
          
          checkMobile();
          window.addEventListener('resize', checkMobile);
          return () => window.removeEventListener('resize', checkMobile);
        }, []);

  const sectionData = [
    {
      id: 'overview',
      title: 'Simulation Overview',
      icon: '🎯',
      content: `This credit card simulator teaches real-world credit card mechanics through an interactive game-like experience. Users learn about billing cycles, interest calculations, payment strategies, and credit score impacts by making actual financial decisions in a safe environment.

The simulation follows authentic credit card operations: spending phase → bill generation → payment phase → new cycle. This mirrors how real credit cards work with monthly billing cycles.`
    },
    {
      id: 'phases',
      title: 'Two-Phase System',
      icon: '🔄',
      content: `The simulator operates in two distinct phases that mirror real credit card usage:

Spending Phase: Users make purchases throughout the month. They can buy items up to their available credit limit. Multiple purchases can be made before generating a bill.

Payment Phase: Once the bill is generated, users must choose how to pay: minimum payment, full payment, custom amount, or skip payment. Each choice has different consequences for interest charges and credit score.

This phase system teaches the importance of timing in credit card management and how billing cycles work.`
    },
    {
      id: 'interest',
      title: 'Interest Calculation',
      icon: '📊',
      content: `Interest is calculated using the standard monthly rate formula:
Monthly Rate = Annual Rate ÷ 12

When Interest Applies:
- Only on unpaid balances carried from previous months
- NOT on new purchases within the same billing cycle (grace period)
- Compounds monthly if balances remain unpaid

Key Learning:The simulation shows how interest-free periods work for new purchases and how carrying balances becomes expensive over time. Users see real-time calculations of how much interest they're accumulating.`
    },
    {
      id: 'payments',
      title: 'Payment Options & Consequences',
      icon: '💳',
      content: `Minimum Payment (Typical 5% of bill):
- Keeps account in good standing
- Results in maximum interest charges
- Small negative impact on credit score
- Demonstrates the "minimum payment trap"

Full Payment:
- Eliminates all interest charges
- Positive credit score boost (+5 points)
- Resets balance to zero
- Shows benefits of paying in full

Custom Payment:
- Allows strategic partial payments
- Moderate credit score impact
- Teaches balance between cash flow and interest costs

Skipping Payment:
- Severe penalties (₹500 late fee)
- Major credit score damage (-25 points)
- Additional interest charges
- Shows real consequences of missed payments`
    },
    {
      id: 'credit-score',
      title: 'Credit Score Mechanics',
      icon: '📈',
      content: `The simulation models real credit score factors:

Payment History (Most Important):
- Full payments: +5 points
- Partial payments: +2 points  
- Minimum payments: -2 points
- Missed payments: -25 points

Credit Utilization (Second Most Important):
- Over 80% utilization: -8 points
- 50-80% utilization: -3 points
- Under 30%: No penalty (ideal range)

Score Ranges:
- 750-850: Excellent (Green)
- 650-749: Good (Yellow)  
- 300-649: Poor (Red)

Users see immediate feedback on how their decisions affect their creditworthiness.`
    },
    {
      id: 'key-metrics',
      title: 'Key Metrics Explained',
      icon: '📋',
      content: `Outstanding Balance: Previous unpaid amounts that accrue interest

Current Spending: New purchases in the current billing cycle

Available Credit: Credit limit minus total outstanding amount

Utilization Ratio: Percentage of credit limit being used (critical for credit score)

Total Interest Paid: Running total of all interest charges (shows true cost of carrying debt)

Bill Amount: Outstanding balance + current spending + accrued interest

The dashboard provides real-time visibility into all these metrics, helping users understand the interconnected nature of credit card finances.`
    },
    {
      id: 'scenarios',
      title: 'Learning Scenarios',
      icon: '🎓',
      content: `Scenario 1: Responsible Use
- Make small purchases
- Pay full balance each month
- Watch credit score improve
- See zero interest charges

Scenario 2: Minimum Payment Trap
- Make large purchase
- Pay only minimums
- Watch interest compound
- See debt spiral effect

Scenario 3: Strategic Partial Payments
- Balance cash flow needs with interest costs
- Learn optimal payment strategies
- Understand trade-offs

Scenario 4: Credit Score Recovery
- Start with poor habits
- Implement better payment strategies
- Watch credit score gradually improve

Each scenario teaches different aspects of credit card financial literacy.`
    },
    {
      id: 'features',
      title: 'Simulator Features',
      icon: '⚙️',
      content: `Interactive Elements:
- Real-time calculations and updates
- Visual feedback through charts and graphs
- Immediate consequences for all actions

Educational Tools:
- Credit score progress bar with color coding
- Utilization ratio pie chart
- Balance history line graph
- Transaction history log

Safety Features:
- Undo function for learning from mistakes
- Reset option to start over
- Clear phase indicators
- Helpful tips and warnings

Gamification:
- Month-by-month progression
- Achievement-style credit score improvements
- Immediate feedback notifications
- Visual progress tracking

The interface is designed to make learning about credit cards engaging while maintaining educational accuracy.`
    },
    {
      id: 'educational-value',
      title: 'Educational Value',
      icon: '🧠',
      content: `Core Learning Objectives:

1. Understanding Interest: How it accumulates, when it applies, and how to avoid it
2. Payment Strategy: Trade-offs between different payment approaches  
3. Credit Score Impact: How financial decisions affect creditworthiness
4. Utilization Management: Keeping credit usage in optimal ranges
5. Billing Cycles: How real credit card timing works
6. Financial Planning: Balancing spending with payment capacity

Why Simulation Works:
- Safe environment to make costly mistakes
- Immediate feedback on decisions
- Repetitive practice builds intuition
- Visual data makes abstract concepts concrete
- Gamification maintains engagement

The simulator bridges the gap between theoretical knowledge and practical understanding of credit card management.`
    }
  ];

  React.useEffect(() => {
  addHoverStyles();
}, []);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>How the Credit Card Simulator Works</h1>
          <p style={styles.subtitle}>
            A comprehensive guide to understanding the educational mechanics and learning objectives
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{...styles.statsGrid,gridTemplateColumns: isMobile? 'repeat(auto-fit, minmax(150px, 1fr))': 'repeat(auto-fit, minmax(200px, 1fr))'}}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎮</div>
            <div style={styles.statValue}>2 Phases</div>
            <div style={styles.statLabel}>Spending & Payment</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>Real-time</div>
            <div style={styles.statLabel}>Interest Calculations</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📈</div>
            <div style={styles.statValue}>Dynamic</div>
            <div style={styles.statLabel}>Credit Score Updates</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💡</div>
            <div style={styles.statValue}>Interactive</div>
            <div style={styles.statLabel}>Learning Experience</div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div style={styles.sectionsContainer}>
          {sectionData.map((section) => (
            <div key={section.id} style={styles.sectionCard}>
              <button
                onClick={() => toggleSection(section.id)}
                style={styles.sectionHeader}
              >
                <div style={styles.sectionHeaderLeft}>
                  <span style={styles.sectionIcon}>{section.icon}</span>
                  <h3 style={styles.sectionTitle}>{section.title}</h3>
                </div>
                <span style={{
                  ...styles.expandIcon,
                  transform: activeSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </button>
              
              {activeSection === section.id && (
                <div style={styles.sectionContent}>
                  <div style={styles.sectionText}>
                    {section.content.split('\n').map((paragraph, index) => {
                      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                        return (
                          <h4 key={index} style={styles.subheading}>
                            {paragraph.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (paragraph.trim().startsWith('-')) {
                        return (
                          <li key={index} style={styles.listItem}>
                            {paragraph.substring(1).trim()}
                          </li>
                        );
                      }
                      return paragraph.trim() ? (
                        <p key={index} style={styles.paragraph}>
                          {paragraph}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* How to Use */}
        <div style={styles.howToUseCard}>
          <h2 style={styles.howToUseTitle}>How to Use the Simulator</h2>
          <div style={styles.stepsContainer}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Setup</h4>
                <p style={styles.stepText}>
                  Enter your credit limit, annual interest rate, and minimum payment percentage. 
                  Try realistic values like ₹50,000 limit with 18% APR.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Spend</h4>
                <p style={styles.stepText}>
                  Make purchases during the spending phase. Try different amounts to see 
                  how utilization affects your credit score in real-time.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Generate Bill</h4>
                <p style={styles.stepText}>
                  When ready, generate your monthly bill. This adds interest charges 
                  on any previous unpaid balance and transitions to payment phase.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>4</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Pay & Learn</h4>
                <p style={styles.stepText}>
                  Choose your payment strategy and see immediate impacts on interest, 
                  credit score, and future debt. Use undo to experiment safely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div style={styles.insightsCard}>
          <h2 style={styles.insightsTitle}>Key Financial Insights</h2>
          <div style={{...styles.insightsGrid,gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))'}}>
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>💰</div>
              <h4 style={styles.insightTitle}>Compound Interest Impact</h4>
              <p style={styles.insightText}>
                See how unpaid balances grow exponentially due to monthly compounding. 
                A ₹10,000 balance at 18% APR costs ₹1,800+ annually in interest alone.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>📉</div>
              <h4 style={styles.insightTitle}>Minimum Payment Trap</h4>
              <p style={styles.insightText}>
                Discover why paying only minimums leads to years of debt. The simulator 
                shows exactly how much extra you pay in interest over time.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>⚡</div>
              <h4 style={styles.insightTitle}>Credit Score Factors</h4>
              <p style={styles.insightText}>
                Learn how payment history and utilization ratio directly impact your 
                credit score. See immediate changes based on your decisions.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>🎯</div>
              <h4 style={styles.insightTitle}>Strategic Thinking</h4>
              <p style={styles.insightText}>
                Develop skills in balancing cash flow needs with long-term financial 
                health. Practice making informed payment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            This simulator is designed for educational purposes to help users understand 
            credit card mechanics and develop better financial literacy skills.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0A0A0A',
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 165, 0, 0.02) 0%, transparent 50%)
    `,
    minHeight: '100vh',
    padding: '20px',
    lineHeight: 1.6,
  },
  
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
  },
  
  subtitle: {
    fontSize: '1.25rem',
    color: '#B8860B',
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '48px',
  },
  
  statCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
    padding: '32px 24px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    display: 'block',
  },
  
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  
  statLabel: {
    fontSize: '0.875rem',
    color: '#94A3B8',
    fontWeight: '500',
  },
  
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '48px',
  },
  
  sectionCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  
  sectionHeader: {
    width: '100%',
    padding: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    color: 'inherit',
  },
  
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  sectionIcon: {
    fontSize: '1.5rem',
  },
  
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: 0,
    textAlign: 'left',
  },
  
  expandIcon: {
    fontSize: '1.25rem',
    color: '#64748B',
    transition: 'all 0.3s ease',
  },
  
  sectionContent: {
    borderTop: '1px solid rgba(255, 215, 0, 0.1)',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, transparent 50%)',
  },
  
  sectionText: {
    padding: '32px',
  },
  
  paragraph: {
    color: '#CBD5E1',
    marginBottom: '16px',
    fontSize: '1rem',
  },
  
  subheading: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: '1.1rem',
    marginTop: '24px',
    marginBottom: '12px',
  },
  
  listItem: {
    color: '#CBD5E1',
    marginBottom: '8px',
    marginLeft: '20px',
    listStyle: 'none',
    position: 'relative',
  },
  
  howToUseCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    marginBottom: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  
  howToUseTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: '40px',
  },
  
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  
  step: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  
  stepText: {
    color: '#CBD5E1',
    fontSize: '0.95rem',
    margin: 0,
  },
  
  insightsCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    marginBottom: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  
  insightsTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: '40px',
  },
  
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
  },
  
  insightItem: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 215, 0, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  
  insightIcon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    display: 'block',
  },
  
  insightTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  
  insightText: {
    color: '#CBD5E1',
    fontSize: '0.95rem',
    margin: 0,
  },
  
  exampleCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    marginBottom: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  
  exampleTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: '40px',
  },
  
  exampleContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  
  exampleScenario: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 50%)',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
  },
  
  exampleSubtitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '24px',
    textAlign: 'center',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
  },
  
  exampleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  
  exampleItem: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  
  exampleLabel: {
    fontSize: '0.875rem',
    color: '#94A3B8',
    marginBottom: '8px',
    fontWeight: '500',
  },
  
  exampleValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFD700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
  },
  
  exampleNote: {
    fontSize: '0.95rem',
    color: '#FBBF24',
    textAlign: 'center',
    fontWeight: '500',
    padding: '16px',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(251, 191, 36, 0.2)',
  },
  
  footer: {
    textAlign: 'center',
    padding: '32px',
    borderTop: '1px solid rgba(59, 130, 246, 0.2)',
  },
  
  footerText: {
    color: '#64748B',
    fontSize: '0.95rem',
    margin: 0,
  },
};

// Add hover effects
const addHoverStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.3);
      border-color: rgba(255, 215, 0, 0.4);
    }
    
    .section-header:hover {
      background-image: linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 165, 0, 0.08) 60%);
      box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.1);
    }
    
    .insight-item:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 215, 0, 0.4);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.2);
    }
    
    .section-content {
      animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .steps-container {
        grid-template-columns: 1fr !important;
      }
      .insights-grid {
        grid-template-columns: 1fr !important;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Add styles when component mounts


export default CreditCardSimulationExplanation;