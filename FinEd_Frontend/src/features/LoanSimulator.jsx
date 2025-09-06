import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const styles = {
  container: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#0A0A0A',
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.02) 0%, transparent 50%)',
    minHeight: '100vh',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  // Animated background particles
  backgroundOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.03) 0%, transparent 50%)',
    zIndex: -1,
    animation: 'pulse 4s ease-in-out infinite alternate',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
    letterSpacing: '-0.02em',
    position: 'relative',
    display: 'inline-block',
    cursor: 'default',
    transition: 'all 0.4s ease',
  },
  titleHover: {
    transform: 'scale(1.05)',
    textShadow: '0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#B8860B',
    fontWeight: '400',
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease',
  },
  setupCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    transform: 'translateY(0) scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    left:'32.5%',
    overflow: 'hidden',
    width:'400px'
  },
  setupCardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  setupTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  formSpace: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#D4AF37',
    marginBottom: '6px',
    transition: 'color 0.3s ease',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    transform: 'scale(1)',
    transition: 'transform 0.2s ease',
  },
  inputContainerHover: {
    transform: 'scale(1.02)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#2A2A2A',
    color: '#FFD700',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#FFD700',
    boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.2)',
    transform: 'scale(1.02)',
  },
  inputWithLeftIcon: {
    paddingLeft: '36px',
  },
  inputWithRightIcon: {
    paddingRight: '36px',
  },
  inputWithRightText: {
    paddingRight: '60px',
  },
  currencySymbol: {
    position: 'absolute',
    left: '12px',
    color: '#B8860B',
    fontWeight: '500',
    fontSize: '1rem',
    pointerEvents: 'none',
    transition: 'color 0.3s ease',
  },
  percentSymbol: {
    position: 'absolute',
    right: '12px',
    color: '#B8860B',
    fontWeight: '500',
    fontSize: '1rem',
    pointerEvents: 'none',
    transition: 'color 0.3s ease',
  },
  monthsSymbol: {
    position: 'absolute',
    right: '12px',
    color: '#8B7355',
    fontSize: '0.875rem',
    fontWeight: '500',
    pointerEvents: 'none',
  },
  startButton: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0A0A0A',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '10px',
    position: 'relative',
    overflow: 'hidden',
    transform: 'scale(1)',
  },
  startButtonHover: {
    transform: 'scale(1.02)',
    backgroundColor: '#FFA500',
    
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeInUp 0.8s ease',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    className: 'cards-grid',
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, transparent 60%)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transform: 'translateY(0) scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  summaryCardHover: {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#B8860B',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    transition: 'color 0.3s ease',
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0',
    transition: 'all 0.3s ease',
  },
  blueValue: { 
    color: '#74B9FF',
    textShadow: '0 0 10px rgba(116, 185, 255, 0.3)',
  },
  redValue: { 
    color: '#FF6B6B',
    textShadow: '0 0 10px rgba(255, 107, 107, 0.3)',
  },
  greenValue: { 
    color: '#4ECDC4',
    textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
  },
  orangeValue: { 
    color: '#FFB347',
    textShadow: '0 0 10px rgba(255, 179, 71, 0.3)',
  },
  purpleValue: { 
    color: '#A29BFE',
    textShadow: '0 0 10px rgba(162, 155, 254, 0.3)',
  },
  smallText: {
    fontSize: '0.75rem',
    color: '#8B7355',
    marginTop: '4px',
    transition: 'color 0.3s ease',
  },
  timelineCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 100%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transform: 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  timelineCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  timelineTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  timeline: {
    display: 'flex',
    overflowX: 'auto',
    gap: '16px',
    paddingBottom: '15px',
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '70px',
    transform: 'scale(1)',
    transition: 'transform 0.3s ease',
  },
  timelineItemHover: {
    transform: 'scale(1.1)',
  },
  timelineCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
  },
  timelineCircleCompleted: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000000',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3), 0 0 0 2px rgba(255, 215, 0, 0.1)',
  },
  timelineCircleDelayed: {
    background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
    color: '#000000',
    boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3), 0 0 0 2px rgba(255, 165, 0, 0.1)',
  },
  timelineCircleCurrent: {
    background: 'linear-gradient(135deg, #FFD700, #C9B037)',
    color: '#000000',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    animation: 'pulse 2s infinite',
  },
  timelineCircleFuture: {
    backgroundColor: '#2A2A2A',
    color: '#8B7355',
    border: '2px solid rgba(139, 115, 85, 0.3)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  timelineLabel: {
    fontSize: '0.8rem',
    color: '#C9B037',
    textAlign: 'center',
    fontWeight: '500',
  },
  currentMonth: {
    marginTop: '16px',
    fontSize: '0.875rem',
    color: '#B8860B',
    textAlign: 'center',
    transition: 'color 0.3s ease',
  },
  actionsCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transform: 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  actionsCardHover: {
    transform: 'scale(1.01)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  actionsTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    className: 'actions-grid',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    transform: 'scale(1) translateY(0)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  actionButtonHover: {
    transform: 'scale(1.08) translateY(-3px)',
    filter: 'brightness(1.1)',
  },
  actionButtonActive: {
    transform: 'scale(0.95) translateY(1px)',
  },
  payButton: {
    background: 'linear-gradient(135deg, #4ECDC4, #FFD700)',
    color: '#000000',
  },
  delayButton: {
    background: 'linear-gradient(135deg, #FFB347, #FFD700)',
    color: '#000000',
  },
  extraButton: {
    background: 'linear-gradient(135deg, #A29BFE, #FFD700)',
    color: '#000000',
  },
  undoButton: {
    background: 'linear-gradient(135deg, #FF6B6B, #FFD700)',
    color: '#000000',
  },
  extraPaymentModal: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 60%)',
    borderRadius: '12px',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)',
    animation: 'modalSlideIn 0.3s ease',
    transform: 'scale(1)',
    transition: 'transform 0.2s ease',
  },
  extraPaymentModalHover: {
    transform: 'scale(1.01)',
  },
  extraPaymentTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  },
  extraPaymentInfo: {
    fontSize: '0.875rem',
    color: '#B8860B',
    marginBottom: '16px',
    transition: 'color 0.3s ease',
  },
  extraPaymentActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  extraPaymentInputContainer: {
    flex: 1,
  },
  extraPaymentDetails: {
    fontSize: '0.875rem',
    color: '#FFD700',
    marginTop: '8px',
    fontWeight: '500',
  },
  extraPaymentButtons: {
    display: 'flex',
    gap: '12px',
  },
  confirmButton: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0A0A0A',
    backgroundColor: '#FFD700',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  confirmButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#FFA500',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
  },
  cancelButton: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: '#2A2A2A',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  cancelButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#3A3A3A',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.2)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    className: 'charts-grid',
  },
  chartCard: {
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    transform: 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  chartCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  chartContainer: {
    height: '300px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  creditScoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  creditScoreBar: {
    width: '100%',
  },
  creditScoreTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#2A2A2A',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  creditScoreProgress: {
    height: '100%',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(90deg, #FF6B6B, #FFD700, #4ECDC4)',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
   
  },
  creditScoreLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: '#8B7355',
    transition: 'color 0.3s ease',
  },
  creditScoreValue: {
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  creditScoreValueHover: {
    transform: 'scale(1.05)',
  },
  creditScoreNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: 1,
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  creditScoreLabel: {
    fontSize: '0.875rem',
    color: '#B8860B',
    marginTop: '4px',
    transition: 'color 0.3s ease',
  },
  creditTip: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#FFB347',
    border: '1px solid rgba(255, 179, 71, 0.2)',
    transition: 'all 0.3s ease',
  },
  resetContainer: {
    textAlign: 'center',
  },
  resetButton: {
    padding: '12px 24px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: '#2A2A2A',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
  },
  resetButtonHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#3A3A3A',
    borderColor: 'rgba(255, 215, 0, 0.5)',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.2)',
  },
  notification: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '400px',
    padding: '16px 20px',
    backgroundColor: '#1A1A1A',
    backgroundImage: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, transparent 60%)',
    color: '#FFD700',
    borderRadius: '8px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.2)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    zIndex: 1000,
    transform: 'translateX(0) scale(1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'slideInFromRight 0.5s ease',
  },
  notificationHover: {
    transform: 'translateX(-5px) scale(1.02)',
    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 215, 0, 0.4)',
  },
  notificationText: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    transition: 'all 0.3s ease',
  },
  
  // Additional interactive elements matching creditStyles
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
  glowEffectActive: {
    opacity: 1,
  },
};

const LoanSimulator = () => {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('12');
  const [duration, setDuration] = useState('12');
  const [originalDuration,setOriginalDuration] = useState('');
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [totalPenaltyPaid, setTotalPenaltyPaid] = useState(0);
  const [totalPrincipalPaid, setTotalPrincipalPaid] = useState(0);
  const [pendingInterest, setPendingInterest] = useState(0);
  const [pendingPenalty, setPendingPenalty] = useState(0);
  const [creditScore, setCreditScore] = useState(700);
  const [notification, setNotification] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [extraPaymentAmount, setExtraPaymentAmount] = useState('');
  const [showExtraPaymentInput, setShowExtraPaymentInput] = useState(false);
  const [originalLoanAmount, setOriginalLoanAmount] = useState(0);
  const [gameStateHistory, setGameStateHistory] = useState([]);

  // Calculate current month's interest due
  
  
  // Calculate penalty due (only if there are pending amounts)
  const currentPenaltyDue = pendingPenalty;

  // Save current state before any action
  const saveCurrentState = () => {
    const currentState = {
      currentMonth,
      remainingBalance,
      totalInterestPaid,
      totalPenaltyPaid,
      totalPrincipalPaid,
      pendingInterest,
      pendingPenalty,
      creditScore,
      balanceHistory: [...balanceHistory],
      loanHistory: [...loanHistory]
    };
    setGameStateHistory(prev => [...prev, currentState]);
  };

  const undoLastAction = () => {
    if (gameStateHistory.length === 0) {
      setNotification('No actions to undo!');
      return;
    }

    const lastState = gameStateHistory[gameStateHistory.length - 1];
    
    // Restore all state values
    setCurrentMonth(lastState.currentMonth);
    setRemainingBalance(lastState.remainingBalance);
    setTotalInterestPaid(lastState.totalInterestPaid);
    setTotalPenaltyPaid(lastState.totalPenaltyPaid);
    setTotalPrincipalPaid(lastState.totalPrincipalPaid);
    setPendingInterest(lastState.pendingInterest);
    setPendingPenalty(lastState.pendingPenalty);
    setCreditScore(lastState.creditScore);
    setBalanceHistory(lastState.balanceHistory);
    setLoanHistory(lastState.loanHistory);
    // if (duration>originalDuration){
    //   setDuration(prev=>prev-1);
    // }
    
    // Remove the last state from history
    setGameStateHistory(prev => prev.slice(0, -1));
    
    setNotification(`↩️ Last action undone! Back to Month ${lastState.currentMonth}.`);
  };

  const calculateEMI = (principal, rate, time) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, time)) / 
                (Math.pow(1 + monthlyRate, time) - 1);
    return Math.round(emi);
  };

  const startSimulation = () => {
    if (!loanAmount || !interestRate || !duration) {
      setNotification('Please fill all fields to start simulation');
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const time = parseInt(duration);
    
    const emi = calculateEMI(principal, rate, time);
    
    setMonthlyEMI(emi);
    setRemainingBalance(principal);
    setOriginalLoanAmount(principal);
    setTotalInterestPaid(0);
    setTotalPenaltyPaid(0);
    setTotalPrincipalPaid(0);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCurrentMonth(1);
    setCreditScore(700);
    setIsSimulationStarted(true);
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);
    setNotification('Simulation started! Choose your payment action for Month 1.');
    
    // Initialize balance history
    const initialHistory = [{ month: 0, balance: principal, creditScore: 700 }];
    setBalanceHistory(initialHistory);
    setLoanHistory([]);
  };

  const resetSimulation = () => {
    setIsSimulationStarted(false);
    setLoanAmount('');
    setInterestRate('');
    setDuration('');
    setOriginalDuration('')
    setCurrentMonth(1);
    setRemainingBalance(0);
    setOriginalLoanAmount(0);
    setTotalInterestPaid(0);
    setTotalPenaltyPaid(0);
    setTotalPrincipalPaid(0);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(700);
    setNotification('');
    setMonthlyEMI(0);
    setBalanceHistory([]);
    setLoanHistory([]);
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);
    setGameStateHistory([]);
  };

  let currentMonthInterest = remainingBalance > 0  ? (remainingBalance * parseFloat(interestRate || 0)) / (12 * 100) : 0;
  if (remainingBalance<monthlyEMI && pendingPenalty==0){
    currentMonthInterest=0;
  }
  const payEMI = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    

    // First pay any pending interest and penalty
    const totalPending = pendingInterest + pendingPenalty;
    const actualPayment = Math.min(monthlyEMI, remainingBalance + totalPending + currentMonthInterest);
   
    
    // Current month's interest
    let currentInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
    
    // Total interest and penalty to be paid this month
    if (remainingBalance<monthlyEMI && totalPending==0){
      currentInterest=0;
    }
    const totalInterestToPay = pendingInterest + currentInterest;
    const totalPenaltyToPay = pendingPenalty;
    
    // Principal payment is what's left after paying interest and penalty
    const principalPayment = Math.max(0, actualPayment - totalInterestToPay - totalPenaltyToPay);
    const newBalance = Math.max(0, remainingBalance - principalPayment);

    setRemainingBalance(newBalance);
    setTotalInterestPaid(prev => prev + totalInterestToPay);
    setTotalPenaltyPaid(prev => prev + totalPenaltyToPay);
    setTotalPrincipalPaid(prev => prev + principalPayment);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(prev => Math.min(850, prev + 2));

    if (currentMonth+1>Number(originalDuration) && newBalance > 0) {
      const monthlyInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
      const penalty = monthlyEMI * 0.1; // 10% penalty
      const extraInterest = monthlyInterest * 0.5; // 50% extra interest for delay
      const totalNewPenalty = penalty + extraInterest;
      setPendingPenalty(prev => prev + totalNewPenalty);
    }
    
    // Update history
    const newHistoryPoint = { 
      month: currentMonth, 
      balance: newBalance, 
      creditScore: Math.min(850, creditScore + 2) 
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, { 
      month: currentMonth, 
      action: 'Paid EMI', 
      amount: actualPayment,
      balance: newBalance 
    }]);
    
    if (newBalance <= 0) {
      setNotification(`🎉 Congratulations! Loan paid off in month ${currentMonth}!`);
      setCurrentMonth(prev=>prev+1);
    } else {
      setNotification(`✅ Great! You paid ₹${Math.round(actualPayment)} on time. Balance reduced to ₹${Math.round(newBalance)}.`);
      setCurrentMonth(prev => {
        if(remainingBalance>0){
          if (prev+1>Number(originalDuration)){
        setDuration((Number(duration)+1).toString());
      }
      return prev+1;
        }
        return prev;
        
      });
    }
  };

  const delayPayment = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    // Calculate this month's interest and penalty (but don't pay them yet)
    const monthlyInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
    const penalty = monthlyEMI * 0.1; // 10% penalty
    const extraInterest = monthlyInterest * 0.5; // 50% extra interest for delay
    const totalNewPenalty = penalty + extraInterest;

    const interestPending = pendingInterest + monthlyInterest;
    const penaltyPending = pendingPenalty + totalNewPenalty;
    
    // Add to pending amounts (not yet paid)
    setPendingInterest(prev => prev + monthlyInterest);
    setPendingPenalty(prev => prev + totalNewPenalty);
    setCreditScore(prev => Math.max(300, prev - 15));
    
    // Update history
    const newHistoryPoint = { 
      month: currentMonth, 
      balance: remainingBalance, // Balance doesn't change when delaying
      creditScore: Math.max(300, creditScore - 15) 
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, { 
      month: currentMonth, 
      action: 'Delayed Payment', 
      amount: 0, // No payment made
      balance: remainingBalance 
    }]);
    
    setNotification(`⏳ Payment delayed! Interest: ₹${Math.round(interestPending)} + Penalty: ₹${Math.round(penaltyPending)} = ₹${Math.round(interestPending+penaltyPending)} will be due next month.`);
    setCurrentMonth(prev => prev + 1);
  };

  const payExtra = () => {
    if (remainingBalance <= 0) {
      setNotification('Loan already paid off!');
      return;
    }

    if (!extraPaymentAmount || parseFloat(extraPaymentAmount) <= 0) {
      setNotification('Please enter a valid custom payment amount');
      return;
    }

    // Save state before making changes
    saveCurrentState();

    const customAmount = parseFloat(extraPaymentAmount);
    
    // First pay any pending interest and penalty
    const totalPending = pendingInterest + pendingPenalty;
    const currentInterest = (remainingBalance * parseFloat(interestRate)) / (12 * 100);
    
    // Total payment available
    const totalPaymentAvailable = customAmount;
    const totalInterestToPay = pendingInterest + currentInterest;
    const totalPenaltyToPay = pendingPenalty;
    
    // Calculate actual payment (can't exceed remaining balance + pending amounts)
    const totalPayment = Math.min(totalPaymentAvailable, remainingBalance + totalPending + currentInterest);
    
    // Principal payment is what's left after paying interest and penalty
    const principalPayment = Math.max(0, totalPayment - totalInterestToPay - totalPenaltyToPay);
    const newBalance = Math.max(0, remainingBalance - principalPayment);
    
    setRemainingBalance(newBalance);
    setTotalInterestPaid(prev => prev + totalInterestToPay);
    setTotalPenaltyPaid(prev => prev + totalPenaltyToPay);
    setTotalPrincipalPaid(prev => prev + principalPayment);
    setPendingInterest(0);
    setPendingPenalty(0);
    setCreditScore(prev => Math.min(850, prev + 5));
    setExtraPaymentAmount('');
    setShowExtraPaymentInput(false);
    
    // Update history
    const newHistoryPoint = { 
      month: currentMonth, 
      balance: newBalance, 
      creditScore: Math.min(850, creditScore + 5) 
    };
    setBalanceHistory(prev => [...prev, newHistoryPoint]);
    setLoanHistory(prev => [...prev, { 
      month: currentMonth, 
      action: 'Custom Payment', 
      amount: totalPayment,
      balance: newBalance 
    }]);
    
    if (newBalance <= 0) {
      setNotification(`🎉 Congratulations! Loan paid off early in month ${currentMonth} with custom payment!`);
    } else {
      setNotification(`💰 Excellent! Custom payment of ₹${Math.round(totalPayment)} made. Balance: ₹${Math.round(newBalance)}`);
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return '#10B981';
    if (score >= 650) return '#F59E0B';
    return '#EF4444';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    return 'Poor';
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Loan Simulator</h1>
          <p style={styles.subtitle}>Understand how loans and EMIs work</p>
        </div>

        {!isSimulationStarted ? (
          /* Loan Setup Card */
          <div style={styles.setupCard}>
            <h2 style={styles.setupTitle}>Setup Your Loan</h2>
            
            <div style={styles.formSpace}>
              <div>
                <label style={styles.label}>Loan Amount</label>
                <div style={styles.inputContainer}>
                  <span style={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{...styles.input, ...styles.inputWithLeftIcon}}
                    placeholder="10000"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Interest Rate</label>
                <div style={styles.inputContainer}>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{...styles.input, ...styles.inputWithRightIcon}}
                    placeholder="12"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <span style={styles.percentSymbol}>%</span>
                </div>
              </div>

              <div>
                <label style={styles.label}>Duration</label>
                <div style={styles.inputContainer}>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value)
                      setOriginalDuration(e.target.value)
                    }
                    }
                    style={{...styles.input, ...styles.inputWithRightText}}
                    placeholder="12"
                    onFocus={(e) => e.target.style.borderColor = '#FFA500'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <span style={styles.monthsSymbol}>months</span>
                </div>
              </div>

              <button
                onClick={startSimulation}
                style={styles.startButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.startButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.startButton)}
              >
                Start Simulation
              </button>
            </div>
          </div>
        ) : (
          /* Simulation Dashboard */
          <div style={styles.dashboard}>
            {/* Summary Cards */}
            <div style={styles.cardsGrid}>

                <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>EMI (per month)</h3>
                <p style={{...styles.cardValue, ...styles.blueValue}}>₹{monthlyEMI.toLocaleString()}</p>
              </div>
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Remaining Balance</h3>
                <p style={{...styles.cardValue, ...styles.redValue}}>₹{Math.round(remainingBalance).toLocaleString()}</p>
              </div>         
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Principal Paid</h3>
                <p style={{...styles.cardValue, ...styles.greenValue}}>₹{Math.round(totalPrincipalPaid).toLocaleString()}</p>
              </div>    
              
              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Interest Paid</h3>
                <p style={{...styles.cardValue, ...styles.orangeValue}}>₹{Math.round(totalInterestPaid).toLocaleString()}</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Penalty Paid</h3>
                <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(totalPenaltyPaid).toLocaleString()}</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Interest Due This Month</h3>
                <p style={{...styles.cardValue, ...styles.orangeValue}}>₹{Math.round(currentMonthInterest + pendingInterest).toLocaleString()}</p>
                <p style={styles.smallText}>
                  {pendingInterest > 0 && `₹${Math.round(pendingInterest)} pending + `}₹{Math.round(currentMonthInterest)} current
                </p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Penalty Due This Month</h3>
                <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(currentPenaltyDue).toLocaleString()}</p>
                <p style={styles.smallText}>Late payment charges</p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Total Due This Month</h3>
                <p style={{...styles.cardValue, color: '#EF4444'}}>₹{Math.round(currentPenaltyDue+currentMonthInterest + pendingInterest).toLocaleString()}</p>
                <p style={styles.smallText}></p>
              </div>

              <div style={styles.summaryCard}>
                <h3 style={styles.cardTitle}>Extra Paid</h3>
                <p style={{...styles.cardValue, ...styles.purpleValue}}>₹{Math.round(totalInterestPaid + totalPenaltyPaid).toLocaleString()}</p>
                <p style={styles.smallText}>Interest + Penalty</p>
              </div>
            </div>

            {/* Timeline */}
            <div style={styles.timelineCard}>
              <h3 style={styles.timelineTitle}>Timeline Progress</h3>
              <div style={styles.timeline}>
                {Array.from({ length: parseInt(duration) }, (_, i) => (
                  <div key={i} style={styles.timelineItem}>
                    <div style={{
                      ...styles.timelineCircle,
                      ...(i + 1 < currentMonth ? loanHistory.find((item) => item.month === i + 1 && item.action=="Delayed Payment") ? styles.timelineCircleDelayed : styles.timelineCircleCompleted :
                          i + 1 === currentMonth ? styles.timelineCircleCurrent :
                          styles.timelineCircleFuture)
                    }}>
                      {i + 1}
                    </div>
                    <span style={styles.timelineLabel}>Month {i + 1}</span>
                  </div>
                ))}
              </div>
              <div style={styles.currentMonth}>
                Current: <span style={{fontWeight: '600', color: '#2563EB'}}>Month {currentMonth}</span>
              </div>
            </div>

            {/* User Actions */}
            {remainingBalance > 0 && (
              <div style={styles.actionsCard}>
                <h3 style={styles.actionsTitle}>Choose Your Action for Month {currentMonth}</h3>
                <div style={styles.actionsGrid}>
                  <button
                    onClick={payEMI}
                    style={{...styles.actionButton, ...styles.payButton}}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <span>✅</span>
                    <span>
                      Pay {
                        (remainingBalance + pendingInterest + pendingPenalty+currentMonthInterest) < monthlyEMI 
                          ? `₹${Math.round(remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest)}` 
                          : `EMI (₹${monthlyEMI})`
                      }
                      {(pendingInterest > 0 || pendingPenalty > 0) && (
                        <span style={{fontSize: '0.75rem', display: 'block'}}>
                          (incl. ₹{Math.round(pendingInterest + pendingPenalty)} pending)
                        </span>
                      )}
                    </span>
                  </button>
                  
                  <button
                    onClick={delayPayment}
                    style={{...styles.actionButton, ...styles.delayButton}}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <span>⏳</span>
                    <span>Delay Payment</span>
                  </button>
                  
                  <button
                    onClick={() => setShowExtraPaymentInput(true)}
                    style={{...styles.actionButton, ...styles.extraButton}}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <span>💰</span>
                    <span>Pay Custom</span>
                  </button>

                  {gameStateHistory.length > 0 && (
                    <button
                      onClick={undoLastAction}
                      style={{...styles.actionButton, ...styles.undoButton}}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <span>↩️</span>
                      <span>Undo Last Action</span>
                    </button>
                  )}
                </div>

                {/* Extra Payment Input Modal */}
                {showExtraPaymentInput && (
                  <div style={styles.extraPaymentModal}>
                    <h4 style={styles.extraPaymentTitle}>Enter Custom Payment Amount</h4>
                    <p style={styles.extraPaymentInfo}>Choose any amount to pay (can be less than, equal to, or more than EMI)</p>
                    <div style={styles.extraPaymentActions}>
                      <div style={styles.extraPaymentInputContainer}>
                        <div style={styles.inputContainer}>
                          <span style={styles.currencySymbol}>₹</span>
                          <input
                            type="number"
                            value={extraPaymentAmount}
                            onChange={(e) => setExtraPaymentAmount(e.target.value)}
                            style={{...styles.input, ...styles.inputWithLeftIcon, borderColor: '#C084FC'}}
                            placeholder="Enter custom amount"
                            min="1"
                            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                            onBlur={(e) => e.target.style.borderColor = '#C084FC'}
                          />
                        </div>
                        {extraPaymentAmount && (
                          <p style={styles.extraPaymentDetails}>
                            Payment amount: ₹{Math.min(parseFloat(extraPaymentAmount || 0), remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest)}
                            {parseFloat(extraPaymentAmount || 0) > (remainingBalance + pendingInterest + pendingPenalty + currentMonthInterest) && (
                              <span style={{color: '#EA580C'}}> (capped at total due)</span>
                            )}
                            {(pendingInterest > 0 || pendingPenalty > 0) && (
                              <span style={{display: 'block', fontSize: '0.75rem', color: '#7C3AED'}}>
                                Includes ₹{Math.round(pendingInterest + pendingPenalty)} pending charges
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div style={styles.extraPaymentButtons}>
                        <button
                          onClick={payExtra}
                          style={styles.confirmButton}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          Confirm Payment
                        </button>
                        <button
                          onClick={() => {
                            setShowExtraPaymentInput(false);
                            setExtraPaymentAmount('');
                          }}
                          style={styles.cancelButton}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {gameStateHistory.length > 0 && remainingBalance==0 && (
                    <button
                      onClick={undoLastAction}
                      style={{...styles.actionButton, ...styles.undoButton}}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#EA580C'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#F97316'}
                    >
                      <span>↩️</span>
                      <span>Undo Last Action</span>
                    </button>
                  )}

            {/* Visualizations */}
            <div style={styles.chartsGrid}>
              {/* Balance Chart */}
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Loan Balance Over Time</h3>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={balanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${Math.round(value).toLocaleString()}`, 'Balance']} />
                      <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Credit Score */}
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Credit Score</h3>
                <div style={styles.creditScoreContainer}>
                  <div style={styles.creditScoreBar}>
                    <div style={styles.creditScoreTrack}>
                      <div
                        style={{
                          ...styles.creditScoreProgress,
                          width: `${((creditScore - 300) / 550) * 100}%`,
                          backgroundColor: getCreditScoreColor(creditScore)
                        }}
                      />
                    </div>
                    <div style={styles.creditScoreLabels}>
                      <span>300</span>
                      <span>850</span>
                    </div>
                  </div>
                  <div style={styles.creditScoreValue}>
                    <div style={{...styles.creditScoreNumber, color: getCreditScoreColor(creditScore)}}>
                      {creditScore}
                    </div>
                    <div style={styles.creditScoreLabel}>{getCreditScoreLabel(creditScore)}</div>
                  </div>
                </div>
                
                <div style={styles.creditTip}>
                  <p>💡 <strong>Tip:</strong> Pay on time to improve your credit score!</p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div style={styles.resetContainer}>
              <button
                onClick={resetSimulation}
                style={styles.resetButton}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Reset Simulation
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {/* {notification && (
          <div style={styles.notification}>
            <p style={styles.notificationText}>{notification}</p>
          </div>
        )} */}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .charts-grid {
              grid-template-columns: 1fr !important;
            }
            .actions-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .extra-payment-actions {
              flex-direction: column !important;
            }
          }
          
          @media (max-width: 480px) {
            .cards-grid {
              grid-template-columns: 1fr !important;
            }
          }
          
          input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          }
          
          button:hover {
            transform: translateY(-1px);
          }
          
          button:active {
            transform: translateY(0);
          }
        `}
      </style>
    </div>
  );
};

export default LoanSimulator;