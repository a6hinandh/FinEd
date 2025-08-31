import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const FinancialSimulatorLanding = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "Real-time interest calculations",
    "Interactive billing cycles", 
    "Credit score tracking",
    "Payment strategy learning",
    "Risk-free environment"
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  

  

  return (
    <div style={styles.container}>
      {/* Animated background elements */}
      <div style={styles.backgroundElements}>
        <div style={styles.floatingElement1}></div>
        <div style={styles.floatingElement2}></div>
        <div style={styles.floatingElement3}></div>
      </div>

      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.mainTitle}>
              Financial Literacy
              <span style={styles.titleAccent}> Simulator</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Master credit cards and loans through interactive simulations. 
              Learn financial concepts in a safe, gamified environment.
            </p>
            
            {/* Rotating features */}
            <div style={styles.featureRotator}>
              <span style={styles.featurePrefix}>Experience: </span>
              <span style={styles.rotatingFeature}>
                {features[currentFeature]}
              </span>
            </div>
          </div>
        </div>

        {/* Main Simulator Options */}
        <div style={styles.simulatorSection}>
          <h2 style={styles.sectionTitle}>Choose Your Learning Path</h2>
          
          <div style={styles.simulatorGrid}>
            {/* Credit Card Simulator */}
            <div 
              style={{
                ...styles.simulatorCard,
                ...(hoveredCard === 'credit' ? styles.simulatorCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard('credit')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardIcon}>💳</div>
              <h3 style={styles.cardTitle}>Credit Card Simulator</h3>
              <p style={styles.cardDescription}>
                Learn about billing cycles, interest rates, minimum payments, and credit scores. 
                Understand how payment strategies affect your financial health.
              </p>
              
              <div style={styles.cardFeatures}>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📊</span>
                  <span>Interest Calculations</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📈</span>
                  <span>Credit Score Impact</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>💰</span>
                  <span>Payment Strategies</span>
                </div>
              </div>
              
              <button onClick={()=>navigate('/credit')} style={styles.simulatorButton}>
                Start Credit Simulation
                <span style={styles.buttonArrow}>→</span>
              </button>

              <button onClick={()=>navigate('/credit!help')} style={{...styles.simulatorButton, marginTop: '20px'}}>
                Learn How It Works
                <span style={styles.buttonArrow}>→</span>
              </button>
            </div>

            {/* Loan Simulator */}
            <div 
              style={{
                ...styles.simulatorCard,
                ...(hoveredCard === 'loan' ? styles.simulatorCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard('loan')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardIcon}>🏠</div>
              <h3 style={styles.cardTitle}>Loan Simulator</h3>
              <p style={styles.cardDescription}>
                Explore different loan types, repayment schedules, and the impact of 
                interest rates on total cost. Plan your borrowing strategy.
              </p>
              
              <div style={styles.cardFeatures}>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📅</span>
                  <span>Repayment Schedules</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🔢</span>
                  <span>EMI Calculations</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>⚖️</span>
                  <span>Loan Comparisons</span>
                </div>
              </div>
              
              <button onClick={()=>navigate('/loan')} style={styles.simulatorButton}>
                Start Loan Simulation
                <span style={styles.buttonArrow}>→</span>
              </button>

              <button onClick={()=>navigate('/loan!help')} style={{...styles.simulatorButton, marginTop: '20px'}}>
                Learn How It Works
                <span style={styles.buttonArrow}>→</span>
              </button>
              
            </div>
          </div>
        </div>

        {/* Learn More Section */}
        {/* <div style={styles.learnMoreSection}>
          <div style={styles.learnMoreCard}>
            <div style={styles.learnMoreIcon}>🧠</div>
            <h3 style={styles.learnMoreTitle}>How Do These Simulations Work?</h3>
            <p style={styles.learnMoreDescription}>
              Discover the educational methodology, calculation logic, and learning objectives 
              behind our financial simulators. Perfect for educators and curious learners.
            </p>
            
            <div style={styles.benefitsGrid}>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>🎯</span>
                <span>Interactive Learning</span>
              </div>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>🔍</span>
                <span>Real-world Mechanics</span>
              </div>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>📚</span>
                <span>Educational Design</span>
              </div>
              <div style={styles.benefit}>
                <span style={styles.benefitIcon}>⚡</span>
                <span>Immediate Feedback</span>
              </div>
            </div>
            
            <button 
              style={styles.learnMoreButton}
              onClick={handleLearnMore}
            >
              <span style={styles.buttonIcon}>📖</span>
              Learn How It Works
              <span style={styles.buttonArrow}>→</span>
            </button>
          </div>
        </div> */}

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <h2 style={styles.statsTitle}>Why Financial Literacy Matters</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>66%</div>
              <div style={styles.statLabel}>of adults lack financial literacy</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>₹2.1L</div>
              <div style={styles.statLabel}>average credit card debt</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>18%</div>
              <div style={styles.statLabel}>typical credit card APR</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>85%</div>
              <div style={styles.statLabel}>learn better through simulation</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Interactive financial education through realistic simulations
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
      radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.02) 0%, transparent 50%)
    `,
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },

  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },

  floatingElement1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },

  floatingElement2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 165, 0, 0.08) 0%, transparent 70%)',
    animation: 'float 8s ease-in-out infinite reverse',
  },

  floatingElement3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)',
    animation: 'float 10s ease-in-out infinite',
  },

  content: {
    position: 'relative',
    zIndex: 1,
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  hero: {
    textAlign: 'center',
    marginBottom: '80px',
    paddingTop: '60px',
  },

  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },

  mainTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
    fontWeight: '900',
    marginBottom: '24px',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },

  titleAccent: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 40px rgba(255, 215, 0, 0.4)',
    animation: 'glow 3s ease-in-out infinite alternate',
  },

  heroSubtitle: {
    fontSize: '1.4rem',
    color: '#D4AF37',
    fontWeight: '400',
    marginBottom: '32px',
    lineHeight: 1.5,
  },

  featureRotator: {
    fontSize: '1.1rem',
    color: '#B8860B',
    fontWeight: '500',
    marginBottom: '40px',
  },

  featurePrefix: {
    color: '#8B7355',
  },

  rotatingFeature: {
    color: '#FFD700',
    fontWeight: '600',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
    transition: 'all 0.5s ease',
  },

  simulatorSection: {
    marginBottom: '80px',
  },

  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: '48px',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
  },

  simulatorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
  },

  simulatorCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 165, 0, 0.04) 100%)',
    borderRadius: '20px',
    padding: '40px',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },

  simulatorCardHover: {
    transform: 'translateY(-12px) scale(1.03)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 3px rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },

  cardIcon: {
    fontSize: '4rem',
    marginBottom: '24px',
    display: 'block',
    textAlign: 'center',
    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))',
  },

  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '16px',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
  },

  cardDescription: {
    fontSize: '1rem',
    color: '#D4AF37',
    lineHeight: 1.6,
    marginBottom: '28px',
    textAlign: 'center',
  },

  cardFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    color: '#B8860B',
    fontWeight: '500',
  },

  featureIcon: {
    fontSize: '1.2rem',
    width: '24px',
    textAlign: 'center',
  },

  simulatorButton: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0A0A0A',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
  },

  buttonArrow: {
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease',
  },

  buttonIcon: {
    fontSize: '1.1rem',
  },

  comingSoon: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: '#B8860B',
    color: '#0A0A0A',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  learnMoreSection: {
    marginBottom: '80px',
    display: 'flex',
    justifyContent: 'center',
  },

  learnMoreCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, transparent 70%)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },

  learnMoreIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block',
    filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.3))',
  },

  learnMoreTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '16px',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
  },

  learnMoreDescription: {
    fontSize: '1rem',
    color: '#D4AF37',
    lineHeight: 1.6,
    marginBottom: '28px',
  },

  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },

  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#B8860B',
    fontWeight: '500',
  },

  benefitIcon: {
    fontSize: '1.1rem',
  },

  learnMoreButton: {
    padding: '14px 28px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: '#2A2A2A',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '0 auto',
  },

  statsSection: {
    marginBottom: '80px'
  },

  statsTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '0 0 25px rgba(255, 215, 0, 0.3)',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },

  statItem: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 60%)',
    padding: '32px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease',
  },

  statNumber: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: '8px',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
  },

  statLabel: {
    fontSize: '0.9rem',
    color: '#B8860B',
    fontWeight: '500',
    lineHeight: 1.4,
  },

  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)',
  },

  footerText: {
    color: '#8B7355',
    fontSize: '0.95rem',
    margin: 0,
  },
};

export default FinancialSimulatorLanding;