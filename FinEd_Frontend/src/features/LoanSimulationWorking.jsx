import React, { useState, useEffect } from 'react';

const LoanSimulationExplanation = () => {
  const [activeSection, setActiveSection] = useState({});
    const [isMobile, setIsMobile] = useState(false);

  const toggleSection = (section) => {
    setActiveSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
      content: `This loan simulator teaches real-world loan mechanics through an interactive experience. Users learn about EMI calculations, interest accumulation, payment strategies, and credit score impacts by making actual financial decisions in a safe environment.

The simulation follows authentic loan operations: loan setup → monthly EMI cycle → payment decisions → consequences. This mirrors how real loans work with monthly payment obligations and the flexibility to pay early or delay payments.`
    },
    {
      id: 'emi-system',
      title: 'EMI Calculation System',
      icon: '🧮',
      content: `The simulator uses the standard EMI formula:
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

Where:
- P = Principal loan amount
- R = Monthly interest rate (Annual rate ÷ 12)
- N = Number of months

Key Learning: Users see how loan amount, interest rate, and duration affect monthly payments. A higher interest rate or longer duration dramatically changes the total cost of borrowing.

The EMI remains constant throughout the loan term, but the proportion of interest vs principal changes each month.`
    },
    {
      id: 'payment-options',
      title: 'Payment Options & Consequences',
      icon: '💳',
      content: `Pay EMI (On-time Payment):
- Maintains good standing
- Reduces principal balance
- Positive credit score impact (+2 points)
- No penalties or extra charges
- Follows normal amortization schedule

Delay Payment:
- Adds 10% penalty on EMI amount
- Adds 50% extra interest on current month
- Severe credit score damage (-15 points)
- Creates pending amounts for next month
- Extends loan duration if balance remains

Custom Payment:
- Allows paying any amount (less than, equal to, or more than EMI)
- Larger payments reduce principal faster
- Smaller payments may not cover full interest
- Positive credit score impact (+5 points for above EMI)
- Demonstrates prepayment benefits`
    },
    {
      id: 'interest-mechanics',
      title: 'Interest & Penalty Mechanics',
      icon: '📊',
      content: `Monthly Interest Calculation:
Monthly Interest = Remaining Balance × (Annual Rate ÷ 12)

Interest Priority: Interest is always paid first before reducing principal balance.

Penalty Structure:
- 10% penalty on EMI amount for delayed payments
- 50% additional interest for the delayed month
- Penalties accumulate if not paid immediately

Pending Amounts: Unpaid interest and penalties carry forward to next month and must be cleared before new principal reduction.

Key Insight: The simulator shows how delays compound costs exponentially and extend loan duration beyond the original term.`
    },
    {
      id: 'credit-score',
      title: 'Credit Score Impact',
      icon: '📈',
      content: `The simulation models realistic credit score factors:

Payment Behavior:
- On-time EMI payments: +2 points
- Custom payments above EMI: +5 points
- Delayed payments: -15 points (severe impact)
- Payment history is the most critical factor

Score Ranges:
- 750-850: Excellent (Green) - Best loan rates
- 650-749: Good (Yellow) - Standard rates
- 300-649: Poor (Red) - High rates or loan rejection

Recovery: Credit score improvements are gradual, while damage from missed payments is immediate and severe. This teaches the importance of consistent payment behavior.`
    },
    {
      id: 'key-metrics',
      title: 'Key Metrics Explained',
      icon: '📋',
      content: `Remaining Balance: Outstanding principal amount still owed

Principal Paid: Portion of loan amount repaid (builds equity)

Interest Paid: Total interest charges paid (cost of borrowing)

Penalty Paid: Additional charges from delayed payments

Interest Due This Month: Current month interest + any pending interest

Penalty Due This Month: Accumulated penalties from delays

Total Due This Month: All charges that must be paid this month

Extra Paid: Total of all interest and penalties (true cost beyond principal)

The dashboard provides real-time visibility into loan amortization and helps users understand the true cost of borrowing.`
    },
    {
      id: 'scenarios',
      title: 'Learning Scenarios',
      icon: '🎓',
      content: `Scenario 1: Disciplined Borrower
- Pay EMI consistently every month
- Watch balance reduce systematically
- Maintain excellent credit score
- Finish loan exactly on schedule

Scenario 2: Aggressive Prepayment
- Make larger payments when possible
- See dramatic interest savings
- Finish loan early
- Build excellent credit history

Scenario 3: Payment Delays
- Skip or delay several payments
- Watch penalties accumulate
- See loan duration extend beyond original term
- Experience credit score damage

Scenario 4: Recovery Strategy
- Start with poor payment habits
- Implement consistent payment strategy
- Watch credit score gradually recover
- Learn optimal payment timing

Each scenario demonstrates different borrowing behaviors and their long-term financial consequences.`
    },
    {
      id: 'features',
      title: 'Simulator Features',
      icon: '⚙️',
      content: `Interactive Elements:
- Real-time EMI calculations
- Dynamic balance tracking
- Immediate credit score feedback
- Timeline visualization of payments

Educational Tools:
- Payment history timeline with color coding
- Balance reduction line chart
- Credit score progress bar
- Total cost breakdown

Safety Features:
- Undo function for learning from mistakes
- Reset option to try different scenarios
- Clear month-by-month progression
- Detailed payment breakdowns

Gamification:
- Month-by-month progression tracking
- Achievement-style credit improvements
- Visual feedback for payment decisions
- Historical action tracking

The interface makes loan management concepts tangible while maintaining mathematical accuracy.`
    },
    {
      id: 'educational-value',
      title: 'Educational Value',
      icon: '🧠',
      content: `Core Learning Objectives:

1. EMI Understanding: How monthly payments are calculated and structured
2. Interest vs Principal: How payment allocation changes over time
3. Prepayment Benefits: Impact of paying more than minimum EMI
4. Delay Consequences: Real cost of missed or late payments
5. Credit Score Management: How payment behavior affects creditworthiness
6. Total Cost Awareness: Understanding the true cost of borrowing

Why Simulation Works:
- Safe environment to experience costly mistakes
- Immediate feedback on payment decisions
- Visual representation of abstract financial concepts
- Hands-on practice with loan management
- Clear cause-and-effect relationships

Real-World Application:
The simulator helps users develop intuition for loan management before taking actual loans, understand the importance of payment discipline, and make informed decisions about prepayment vs other financial priorities.`
    }
  ];

  useEffect(() => {
    addHoverStyles();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>How the Loan Simulator Works</h1>
          <p style={styles.subtitle}>
            A comprehensive guide to understanding loan mechanics and EMI management
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{...styles.statsGrid,gridTemplateColumns: isMobile? 'repeat(auto-fit, minmax(150px, 1fr))': 'repeat(auto-fit, minmax(200px, 1fr))'}}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏦</div>
            <div style={styles.statValue}>EMI Based</div>
            <div style={styles.statLabel}>Monthly Payments</div>
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
              
              {activeSection[section.id] && (
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
          <h2 style={styles.howToUseTitle}>How to Use the Loan Simulator</h2>
          <div style={styles.stepsContainer}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Setup</h4>
                <p style={styles.stepText}>
                  Enter your loan amount, annual interest rate, and duration in months. 
                  Try realistic values like ₹100,000 loan at 12% APR for 24 months.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>View EMI</h4>
                <p style={styles.stepText}>
                  See your calculated monthly EMI and understand how much you need 
                  to pay each month to clear the loan on schedule.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Make Payment Decisions</h4>
                <p style={styles.stepText}>
                  Each month, choose to pay EMI on time, delay payment, or pay a custom 
                  amount. See immediate impacts on balance and credit score.
                </p>
              </div>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>4</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Track Progress</h4>
                <p style={styles.stepText}>
                  Monitor your loan balance, total interest paid, and credit score 
                  changes. Use undo to experiment with different strategies safely.
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
              <h4 style={styles.insightTitle}>EMI Composition</h4>
              <p style={styles.insightText}>
                Early payments contain more interest, later payments more principal. 
                See how amortization works and why prepayment saves significantly.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>⚡</div>
              <h4 style={styles.insightTitle}>Prepayment Power</h4>
              <p style={styles.insightText}>
                Discover how paying extra principal early can save thousands in interest 
                and shorten loan duration dramatically.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>📉</div>
              <h4 style={styles.insightTitle}>Delay Costs</h4>
              <p style={styles.insightText}>
                Learn the true cost of missed payments: penalties, extra interest, 
                extended duration, and severe credit score damage.
              </p>
            </div>
            
            <div style={styles.insightItem}>
              <div style={styles.insightIcon}>🎯</div>
              <h4 style={styles.insightTitle}>Payment Strategy</h4>
              <p style={styles.insightText}>
                Develop skills in balancing loan payments with cash flow needs. 
                Practice making informed borrowing and repayment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* EMI Breakdown Example */}
        <div style={styles.exampleCard}>
          <h2 style={styles.exampleTitle}>EMI Breakdown Example</h2>
          <div style={styles.exampleContent}>
            <div style={styles.exampleScenario}>
              <h4 style={styles.exampleSubtitle}>Sample Loan: ₹100,000 at 12% for 12 months</h4>
              <div style={{...styles.exampleGrid,gridTemplateColumns: isMobile? "repeat(1, 1fr)" : "repeat(2, 1fr)"}   }>
                <div style={styles.exampleItem}>
                  <div style={styles.exampleLabel}>Monthly EMI</div>
                  <div style={styles.exampleValue}>₹8,885</div>
                </div>
                <div style={styles.exampleItem}>
                  <div style={styles.exampleLabel}>Total Payments</div>
                  <div style={styles.exampleValue}>₹1,06,620</div>
                </div>
                <div style={styles.exampleItem}>
                  <div style={styles.exampleLabel}>Total Interest</div>
                  <div style={styles.exampleValue}>₹6,620</div>
                </div>
                <div style={styles.exampleItem}>
                  <div style={styles.exampleLabel}>Interest Rate</div>
                  <div style={styles.exampleValue}>6.62%</div>
                </div>
              </div>
              <div style={styles.exampleNote}>
                If you delay payments twice, penalties could add ₹3,000+ to your total cost!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            This simulator is designed for educational purposes to help users understand 
            loan mechanics and develop better financial literacy skills for borrowing decisions.
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
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(59, 130, 246, 0.4);
    }
    
    .section-header:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
    
    .insight-item:hover {
      transform: translateY(-4px);
      border-color: rgba(236, 72, 153, 0.3);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
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
      .example-grid {
        grid-template-columns: 1fr !important;
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

export default LoanSimulationExplanation;